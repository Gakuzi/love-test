// ============================
// Конфигурация
// ============================

const SHEET_ID = '12PUk32kI3NmYPrjMh3BOc2RWsB070lQcfvsy0PCvNOs';

// Старый лист (англ. заголовки) оставляем на месте, новый — с русскими заголовками
const SHEET_NAME_RU = 'Результаты';
const SHEET_NAME_WIDE = 'Результаты по вопросам';
const SHEET_NAME_EVENTS = 'События';
const SHEET_NAME_QUESTIONS = 'Вопросы';
const SHEET_NAME_RECO = 'Рекомендации';
const SHEET_NAME_FORMULAS = 'Формулы';
const SHEET_NAME_README = 'Инструкция';
const SHEET_NAME_PLAN = 'План';

const SHARED_TOKEN = 'rk7GJ6QdZC3M5p9X2a8Vn0L4s1HfEwBt';

// Заголовки (рус)
const HEADERS_RU = [
  'Дата/время',
  'Имя пользователя',
  'Имя отправителя',
  'Имя получателя',
  'Анонимный пользователь (UUID)',
  'Кем приглашён (UUID)',
  'Метка (utm/ref)',
  'ref',
  'Канал (utm_source)',
  'Страница',
  'Браузер',
  'Язык',
  'Статус',
  'Общее состояние',
  'Приоритетный блок',
  'Ответы (подробно, JSON)',
  'Итоги по блокам (JSON)'
];

// ============================
// Вспомогательные функции
// ============================

function parseJsonSafe(str) {
  try { return JSON.parse(str); } catch (e) { return null; }
}

function getMoscowTime() {
  // Получаем текущее время в московском часовом поясе
  const now = new Date();
  const moscowOffset = 3; // UTC+3 для московского времени
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const moscowTime = new Date(utc + (moscowOffset * 3600000));
  
  // Форматируем в строку, которую Google Sheets правильно распознает как дату
  const year = moscowTime.getFullYear();
  const month = String(moscowTime.getMonth() + 1).padStart(2, '0');
  const day = String(moscowTime.getDate()).padStart(2, '0');
  const hours = String(moscowTime.getHours()).padStart(2, '0');
  const minutes = String(moscowTime.getMinutes()).padStart(2, '0');
  const seconds = String(moscowTime.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function openSheet_() {
  return SpreadsheetApp.openById(SHEET_ID);
}

function ensureRuSheetAndHeader_() {
  const ss = openSheet_();
  let sheet = ss.getSheetByName(SHEET_NAME_RU);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME_RU);
  const lastCol = sheet.getLastColumn();
  if (lastCol === 0) {
    sheet.getRange(1, 1, 1, HEADERS_RU.length).setValues([HEADERS_RU]);
  } else {
    const current = sheet.getRange(1, 1, 1, Math.max(lastCol, HEADERS_RU.length)).getValues()[0];
    var changed = false;
    for (var i = 0; i < HEADERS_RU.length; i++) {
      if ((current[i] || '') !== HEADERS_RU[i]) { changed = true; break; }
    }
    if (changed || lastCol !== HEADERS_RU.length) {
      sheet.getRange(1, 1, 1, HEADERS_RU.length).setValues([HEADERS_RU]);
    }
  }
  return sheet;
}

function normalizeHeaderText_(t) {
  if (!t) return '';
  t = String(t).replace(/\s+/g, ' ').trim();
  if (t.length > 100) t = t.slice(0, 97) + '…';
  return t;
}

function ensureWideSheetAndHeaders_(answersDetailed) {
  const ss = openSheet_();
  let sheet = ss.getSheetByName(SHEET_NAME_WIDE);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME_WIDE);

  // Метаданные + вопросы (только выбранные варианты в ячейках)
  const metaHeaders = [
    'Дата/время',
    'Имя пользователя',
    'Анонимный пользователь (UUID)',
    'Кем приглашён (UUID)',
    'Метка (utm/ref)'
  ];
  const sorted = (answersDetailed || []).slice().sort(function(a,b){return (a.порядковыйИндекс||0)-(b.порядковыйИндекс||0)});
  const questionHeaders = sorted.map(function(a){
    var qnum = String(a.номерВопроса || (a.порядковыйИндекс+1)).padStart(2,'0');
    return 'Q' + qnum + ': ' + normalizeHeaderText_(a.вопрос || '');
  });
  const headers = metaHeaders.concat(questionHeaders);

  const lastCol = sheet.getLastColumn();
  if (lastCol === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  } else {
    if (sheet.getLastColumn() !== headers.length) {
      sheet.clear();
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    } else {
      const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
      if (current.join('|') !== headers.join('|')) {
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      }
    }
  }
  return sheet;
}

function ensureEventsSheet_() {
  const ss = openSheet_();
  let sheet = ss.getSheetByName(SHEET_NAME_EVENTS);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME_EVENTS);
  const headers = ['Дата/время','Анонимный пользователь (UUID)','ref','Событие','Детали'];
  const lastCol = sheet.getLastColumn();
  if (lastCol === 0) sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  return sheet;
}

function getConfigFromSheet_() {
  const ss = openSheet_();
  const sh = ss.getSheetByName(SHEET_NAME_QUESTIONS);
  if (!sh) return null;
  const values = sh.getDataRange().getValues();
  if (!values || values.length < 2) return null;
  const header = values[0];
  const idx = function(name){ return header.indexOf(name); };
  const colId = idx('id');
  const colBlock = idx('block');
  const colBlockIndex = idx('blockIndex');
  const colText = idx('text');
  const colHint = idx('hint');
  const colOptions = idx('options'); // JSON: [{value,label}]
  if ([colId,colBlock,colBlockIndex,colText,colHint,colOptions].some(function(v){return v<0;})) return null;
  var questions = [];
  for (var r=1; r<values.length; r++) {
    var row = values[r];
    if (!row[colId]) continue;
    var opts = [];
    try { opts = JSON.parse(String(row[colOptions]||'[]')); } catch(_) {}
    questions.push({
      id: Number(row[colId]),
      block: String(row[colBlock]||''),
      blockIndex: Number(row[colBlockIndex]||0),
      text: String(row[colText]||''),
      options: Array.isArray(opts)?opts:[],
      hint: String(row[colHint]||'')
    });
  }
  return { version: 1, questions: questions };
}

function getRecommendationsFromSheet_() {
  const ss = openSheet_();
  const sh = ss.getSheetByName(SHEET_NAME_RECO);
  if (!sh) return {};
  const values = sh.getDataRange().getValues();
  if (!values || values.length < 2) return {};
  const header = values[0];
  const idx = function(name){ return header.indexOf(name); };
  const colBlockIndex = idx('blockIndex');
  const colZone = idx('zone');
  const colTitle = idx('title');
  const colText = idx('text');
  if ([colBlockIndex,colZone,colTitle,colText].some(function(v){return v<0;})) return {};
  var map = {};
  for (var r=1; r<values.length; r++) {
    var row = values[r];
    var bi = Number(row[colBlockIndex]||0);
    var zone = String(row[colZone]||'');
    var title = String(row[colTitle]||'');
    var text = String(row[colText]||'');
    if (!map[bi]) map[bi] = {};
    if (!map[bi][zone]) map[bi][zone] = [];
    map[bi][zone].push({ title: title, text: text });
  }
  return map;
}

function getPlanFromSheet_() {
  const ss = openSheet_();
  const sh = ss.getSheetByName(SHEET_NAME_PLAN);
  if (!sh) return {};
  const values = sh.getDataRange().getValues();
  if (!values || values.length < 2) return {};
  const header = values[0];
  const idx = function(name){ return header.indexOf(name); };
  const colBlockIndex = idx('blockIndex');
  const colTimeframe = idx('timeframe');
  const colTitle = idx('title');
  const colDescription = idx('description');
  if ([colBlockIndex,colTimeframe,colTitle,colDescription].some(function(v){return v<0;})) return {};
  var map = {};
  for (var r=1; r<values.length; r++) {
    var row = values[r];
    var bi = String(row[colBlockIndex]||'0');
    var timeframe = String(row[colTimeframe]||'');
    var title = String(row[colTitle]||'');
    var description = String(row[colDescription]||'');
    if (!map[bi]) map[bi] = [];
    map[bi].push({ timeframe: timeframe, title: title, description: description });
  }
  return map;
}

// ============================
// HTTP обработчики
// ============================

function doPost(e) {
  const body = e && e.postData ? e.postData.contents : null;
  const data = parseJsonSafe(body) || {};

  if (SHARED_TOKEN && data.token !== SHARED_TOKEN) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Используем московское время
  const moscowTimestamp = getMoscowTime();

  // 1) Лист с русскими заголовками + JSON полями
  const sheetRu = ensureRuSheetAndHeader_();
  const values = sheetRu.getDataRange().getValues();
  const header = values[0] || [];
  const colIndex = function(name){ return (header.indexOf(name) + 1) || -1; };

  const uuidCol = colIndex('Анонимный пользователь (UUID)');
  const refCol = colIndex('ref');
  const tagCol = colIndex('Метка (utm/ref)');
  const statusCol = colIndex('Статус');

  // Ищем существующую строку по UUID и ref.
  // Логика:
  // - если пришёл ref='auto-save' → ищем строку UUID+ref='auto-save'
  // - если пришёл ref='final-results' → 
  //     сначала ищем UUID+ref='auto-save' (чтобы превратить её в финальную),
  //     если не нашли — ищем UUID+ref='final-results'
  // - иначе, если ref пуст → ищем UUID+tag='auto-save' (совместимость)
  let targetRow = -1;
  if (values.length > 1 && uuidCol > 0) {
    const uuid = String(data.userId || '');
    const incomingRef = String(data.ref || '');
    const tag = String(data.tag || '');

    function rowMatches(r, expectedRef) {
      const row = values[r-1];
      const rowUuid = String(row[uuidCol-1] || '');
      const rowRef = refCol>0 ? String(row[refCol-1] || '') : '';
      return rowUuid === uuid && rowRef === expectedRef;
    }

    if (incomingRef === 'auto-save') {
      for (var r = 2; r <= values.length; r++) {
        if (rowMatches(r, 'auto-save')) { targetRow = r; break; }
      }
    } else if (incomingRef === 'final-results') {
      for (var r = 2; r <= values.length; r++) {
        if (rowMatches(r, 'auto-save')) { targetRow = r; break; }
      }
      if (targetRow < 0) {
        for (var r2 = 2; r2 <= values.length; r2++) {
          if (rowMatches(r2, 'final-results')) { targetRow = r2; break; }
        }
      }
    } else {
      // Совместимость со старым форматом без ref
      if (tagCol > 0) {
        for (var r3 = 2; r3 <= values.length; r3++) {
          const row = values[r3-1];
          const rowUuid = String(row[uuidCol-1] || '');
          const rowTag = String(row[tagCol-1] || '');
          if (rowUuid === uuid && rowTag === 'auto-save') { targetRow = r3; break; }
        }
      }
    }
  }

  const rowRu = [
    moscowTimestamp,
    data.userName || '',
    data.senderName || '',
    data.recipientName || '',
    data.userId || '',
    data.invitedBy || '',
    data.tag || '',
    data.ref || '',
    data.utmSource || '',
    data.url || '',
    data.userAgent || '',
    data.language || '',
    data.status || '',
    data.overall || '',
    data.priorityBlock || '',
    JSON.stringify(data.answersDetailed || data.answers || {}),
    JSON.stringify(data.blockResultsDetailed || data.blockResults || {})
  ];

  if (targetRow > 0) {
    // Обновляем найденную строку (включая переход из auto-save в final-results)
    sheetRu.getRange(targetRow, 1, 1, rowRu.length).setValues([rowRu]);
  } else {
    // Нет подходящей строки — создаём новую
    sheetRu.appendRow(rowRu);
  }

  // 2) Лист по вопросам (развёрнуто)
  const sheetWide = ensureWideSheetAndHeaders_(data.answersDetailed || []);

  // Собираем строку: мета + ответы
  const meta = [
    moscowTimestamp,
    data.userName || '',
    data.userId || '',
    data.invitedBy || '',
    data.tag || ''
  ];
  const sortedAnswers = (data.answersDetailed || []).slice().sort(function(a,b){return (a.порядковыйИндекс||0)-(b.порядковыйИндекс||0)});
  const answers = sortedAnswers.map(function(a){ return a.выбранныйВариант || ''; });

  const rowWide = meta.concat(answers);
  sheetWide.appendRow(rowWide);

  // 3) Лог событий по действиям (если передан event)
  if (data.event) {
    const ev = ensureEventsSheet_();
    ev.appendRow([moscowTimestamp, data.userId || '', data.ref || '', String(data.event||''), JSON.stringify(data.eventPayload || {})]);
  }

  // 4) Анализ по запросу из клиента (для data-driven режима)
  if (data.action === 'analyze') {
    var res = calculateAnalysis_(data.answers || {});
    return ContentService.createTextOutput(JSON.stringify({ ok: true, analysis: res }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : '';
  if (action === 'config') {
    // Читаем конфигурацию из листа «Вопросы»
    const cfg = getConfigFromSheet_() || { version: 1, questions: [] };
    const reco = getRecommendationsFromSheet_();
    const plan = getPlanFromSheet_();
    return ContentService.createTextOutput(JSON.stringify({ ok: true, config: cfg, recommendations: reco, plan: plan }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  if (action === 'init') {
    // Безопасность: требуем токен
    if (!(e && e.parameter && e.parameter.token === SHARED_TOKEN)) {
      return ContentService.createTextOutput(JSON.stringify({ ok:false, error: 'unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    const seeded = initSheets_();
    return ContentService.createTextOutput(JSON.stringify({ ok: true, seeded: seeded }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: 'relationship-test-sink' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function calculateAnalysis_(answersObj) {
  // answersObj: { index:number -> value:number }
  var blockResults = { 0:null, 1:null, 2:null, 3:null };
  for (var bi=0; bi<4; bi++) {
    var start = bi*5; var end = start+5; var sum = 0;
    for (var i=start; i<end; i++) sum += Number(answersObj[i]||0);
    var zone = sum>=11 ? 'success' : (sum>=6 ? 'warning' : 'danger');
    blockResults[bi] = { sum: sum, zone: zone };
  }
  var total = 0; for (var k in blockResults) { var b = blockResults[k]; if (b) total += b.sum; }
  var avg = total/4;
  var overall = avg<8 ? 'разрушительные' : (avg<11 ? 'шаткие' : 'зрелые');
  var lowest = { index: 0, sum: 9999 };
  for (var j=0;j<4;j++){ var br=blockResults[j]; if (br && br.sum<lowest.sum) lowest={index:j,sum:br.sum}; }
  var blockNames = ['Безопасность','Надёжность','Связь','Рост'];
  var priorityBlock = blockNames[lowest.index];
  return { blockResults: blockResults, overall: overall, priorityBlock: priorityBlock };
}

function ensureSheetWithHeaders_(name, headers) {
  const ss = openSheet_();
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  const lastCol = sh.getLastColumn();
  if (lastCol === 0) {
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  } else {
    const current = sh.getRange(1, 1, 1, headers.length).getValues()[0];
    if (current.join('|') !== headers.join('|')) {
      sh.clear();
      sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
  }
  return sh;
}

function seedQuestionsWithDefaults_(sh) {
  const rows = [
    // id, block, blockIndex, text, hint, options(JSON)
    [1,'Безопасность',0,'Могу ли я спокойно сказать «нет» партнёру, не опасаясь последствий или конфликтов?','Речь идёт о том, чувствуете ли вы, что можете отказывать в чём-либо — в близости, в помощи, в совместных планах — и при этом не столкнётесь с обидой...', JSON.stringify([{value:3,label:'Да'},{value:2,label:'Скорее да'},{value:1,label:'Скорее нет'},{value:0,label:'Нет'}])],
    [2,'Безопасность',0,'Уважает ли партнёр моё личное пространство, когда я прошу об этом?','Личное пространство — это не только физическое...', JSON.stringify([{value:3,label:'Да'},{value:2,label:'Скорее да'},{value:1,label:'Скорее нет'},{value:0,label:'Нет'}])],
    [3,'Безопасность',0,'Чувствую ли я, что могу быть собой рядом с партнёром, без масок и напряжения?','Вы можете плакать, молчать...', JSON.stringify([{value:3,label:'Да'},{value:2,label:'Скорее да'},{value:1,label:'Скорее нет'},{value:0,label:'Нет'}])],
    [4,'Безопасность',0,'Испытываю ли я уважение к своим эмоциям со стороны партнёра?','Когда вы говорите: «Мне грустно»...', JSON.stringify([{value:3,label:'Да'},{value:2,label:'Скорее да'},{value:1,label:'Скорее нет'},{value:0,label:'Нет'}])],
    [5,'Безопасность',0,'Есть ли в наших отношениях признаки давления: крики, молчание «в наказание», шантаж, манипуляции?','Обратите внимание: крик, игнорирование...', JSON.stringify([{value:0,label:'Да'},{value:1,label:'Скорее да'},{value:2,label:'Скорее нет'},{value:3,label:'Нет'}])],
    [6,'Надёжность',1,'Выполняет ли партнёр свои обещания, даже мелкие?','Речь не только о крупных обещаниях...', JSON.stringify([{value:3,label:'Да'},{value:2,label:'Скорее да'},{value:1,label:'Скорее нет'},{value:0,label:'Нет'}])],
    [7,'Надёжность',1,'Чувствую ли я, что мы в одной команде, особенно в сложные моменты?','В кризис вы чувствуете поддержку?', JSON.stringify([{value:3,label:'Да'},{value:2,label:'Скорее да'},{value:1,label:'Скорее нет'},{value:0,label:'Нет'}])],
    [8,'Надёжность',1,'Разделены ли между нами бытовые и финансовые обязанности честно и понятно?','Деление обязанностей...', JSON.stringify([{value:3,label:'Да'},{value:2,label:'Скорее да'},{value:1,label:'Скорее нет'},{value:0,label:'Нет'}])],
    [9,'Надёжность',1,'Можем ли мы говорить о деньгах без скандалов и обвинений?','Тема денег — одна из самых острых...', JSON.stringify([{value:3,label:'Да'},{value:2,label:'Скорее да'},{value:1,label:'Скорее нет'},{value:0,label:'Нет'}])],
    [10,'Надёжность',1,'Является ли партнёр предсказуемым в вопросах времени, ресурсов, обязательств?','Предсказуемость — это когда вы знаете, чего ожидать...', JSON.stringify([{value:3,label:'Да'},{value:2,label:'Скорее да'},{value:1,label:'Скорее нет'},{value:0,label:'Нет'}])],
    [11,'Связь',2,'Есть ли в наших отношениях ежедневные ритуалы внимания (объятие, поцелуй, «как день прошёл?»)?','Ритуалы — маленькие проявления заботы...', JSON.stringify([{value:3,label:'Да'},{value:2,label:'Скорее да'},{value:1,label:'Скорее нет'},{value:0,label:'Нет'}])],
    [12,'Связь',2,'Можем ли мы делиться своими чувствами, а не только обсуждать дела и быт?','Разговоры о чувствах...', JSON.stringify([{value:3,label:'Да'},{value:2,label:'Скорее да'},{value:1,label:'Скорее нет'},{value:0,label:'Нет'}])],
    [13,'Связь',2,'Чувствую ли я, что партнёр меня слышит и понимает?','Слышать — это не просто слова...', JSON.stringify([{value:3,label:'Да'},{value:2,label:'Скорее да'},{value:1,label:'Скорее нет'},{value:0,label:'Нет'}])],
    [14,'Связь',2,'Умеем ли мы мириться и признавать свои ошибки после конфликта?','Конфликты бывают у всех...', JSON.stringify([{value:3,label:'Да'},{value:2,label:'Скорее да'},{value:1,label:'Скорее нет'},{value:0,label:'Нет'}])],
    [15,'Связь',2,'Комфортно ли нам быть вдвоём без отвлечений — телефонов, дел, посторонних?','Провести время вдвоём...', JSON.stringify([{value:3,label:'Да'},{value:2,label:'Скорее да'},{value:1,label:'Скорее нет'},{value:0,label:'Нет'}])],
    [16,'Рост',3,'Обсуждали ли мы взгляды друг друга на ключевые темы (деньги, верность, дети, работа)?','Глубокие ценности...', JSON.stringify([{value:3,label:'Да'},{value:2,label:'Скорее да'},{value:1,label:'Скорее нет'},{value:0,label:'Нет'}])],
    [17,'Рост',3,'Есть ли у нас общие цели на будущее, которые мы реально обсуждали?','Общие цели...', JSON.stringify([{value:3,label:'Да'},{value:2,label:'Скорее да'},{value:1,label:'Скорее нет'},{value:0,label:'Нет'}])],
    [18,'Рост',3,'Эти отношения помогают мне становиться лучшей версией себя?','Рост и развитие...', JSON.stringify([{value:3,label:'Да'},{value:2,label:'Скорее да'},{value:1,label:'Скорее нет'},{value:0,label:'Нет'}])],
    [19,'Рост',3,'Чувствую ли я, что могу развиваться, а не только адаптироваться?','Развитие vs адаптация...', JSON.stringify([{value:3,label:'Да'},{value:2,label:'Скорее да'},{value:1,label:'Скорее нет'},{value:0,label:'Нет'}])],
    [20,'Рост',3,'Уважаю ли я партнёра, даже если мы не согласны или в конфликте?','Уважение в конфликте...', JSON.stringify([{value:3,label:'Да'},{value:2,label:'Скорее да'},{value:1,label:'Скорее нет'},{value:0,label:'Нет'}])]
  ];
  if (sh.getLastRow() > 1) return;
  sh.getRange(2,1,rows.length,6).setValues(rows);
}

function seedRecommendationsWithDefaults_(sh) {
  const rows = [];
  const titles = {
    success: 'Сохраняйте сильные стороны',
    warning: 'Зона роста',
    danger: 'Приоритетная зона внимания'
  };
  for (var bi=0; bi<4; bi++) {
    ['success','warning','danger'].forEach(function(zone){
      rows.push([bi, zone, titles[zone], 'Добавьте 2–3 конкретных шага для этого блока и зоны']);
    });
  }
  if (sh.getLastRow() > 1) return;
  sh.getRange(2,1,rows.length,4).setValues(rows);
}

function seedFormulasWithDefaults_(sh) {
  const rows = [
    ['threshold_success_min', 11, 'Сумма 5 вопросов в блоке ≥ 11 → зона силы'],
    ['threshold_warning_min', 6, 'Сумма 5 вопросов в блоке ≥ 6 → зона роста'],
    ['overall_avg_danger_max', 8, 'Средний балл по блокам < 8 → разрушительные'],
    ['overall_avg_warning_max', 11, 'Средний балл по блокам < 11 → шаткие']
  ];
  if (sh.getLastRow() > 1) return;
  sh.getRange(2,1,rows.length,3).setValues(rows);
}

function ensureReadmeSheet_() {
  const ss = openSheet_();
  let sh = ss.getSheetByName(SHEET_NAME_README);
  if (!sh) sh = ss.insertSheet(SHEET_NAME_README);
  sh.clear();
  const notes = [
    ['Инструкция по редактированию теста'],
    ['— Лист «Вопросы»: id, block, blockIndex, text, hint, options(JSON)'],
    ['— Лист «Рекомендации»: blockIndex (0..3), zone (success|warning|danger), title, text'],
    ['— Лист «Формулы»: параметр, значение, комментарий (используйте для документирования логики)'],
    ['— Лист «Результаты» и «Результаты по вопросам» — заполняются приложением автоматически'],
    ['— Лист «События» — лог кликов, шэринга, добавлений в календарь и пр.']
  ];
  sh.getRange(1,1,notes.length,1).setValues(notes);
}

function initSheets_() {
  const qHeaders = ['id','block','blockIndex','text','hint','options'];
  const rHeaders = ['blockIndex','zone','title','text'];
  const fHeaders = ['param','value','comment'];
  const pHeaders = ['blockIndex','timeframe','title','description'];
  const q = ensureSheetWithHeaders_(SHEET_NAME_QUESTIONS, qHeaders);
  const r = ensureSheetWithHeaders_(SHEET_NAME_RECO, rHeaders);
  const f = ensureSheetWithHeaders_(SHEET_NAME_FORMULAS, fHeaders);
  const p = ensureSheetWithHeaders_(SHEET_NAME_PLAN, pHeaders);
  seedQuestionsWithDefaults_(q);
  seedRecommendationsWithDefaults_(r);
  seedFormulasWithDefaults_(f);
  seedPlanWithDefaults_(p);
  ensureReadmeSheet_();
  return { ok: true };
}

function seedPlanWithDefaults_(sh) {
  const frames = ['На этой неделе','В течение месяца','Долгосрочно'];
  const rows = [];
  for (var bi=0; bi<4; bi++) {
    frames.forEach(function(tf){
      rows.push([bi, tf, 'Действие', 'Опишите конкретный шаг для улучшения отношений в этом блоке']);
    });
  }
  if (sh.getLastRow() > 1) return;
  sh.getRange(2,1,rows.length,4).setValues(rows);
}