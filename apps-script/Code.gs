// ============================
// Конфигурация
// ============================

const SHEET_ID = '12PUk32kI3NmYPrjMh3BOc2RWsB070lQcfvsy0PCvNOs';

// Старый лист (англ. заголовки) оставляем на месте, новый — с русскими заголовками
const SHEET_NAME_RU = 'Результаты';
const SHEET_NAME_WIDE = 'Результаты по вопросам';

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

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: 'relationship-test-sink' }))
    .setMimeType(ContentService.MimeType.JSON);
}