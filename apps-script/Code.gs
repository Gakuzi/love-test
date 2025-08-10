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
  'Анонимный пользователь (UUID)',
  'Кем приглашён (UUID)',
  'Метка (utm/ref)',
  'Страница',
  'Браузер',
  'Язык',
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
    const current = sheet.getRange(1, 1, 1, HEADERS_RU.length).getValues()[0];
    if (current.join('|') !== HEADERS_RU.join('|')) {
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

  // 1) Лист с русскими заголовками + JSON полями
  const sheetRu = ensureRuSheetAndHeader_();
  const rowRu = [
    data.timestamp || new Date().toISOString(),
    data.userId || '',
    data.invitedBy || '',
    data.tag || '',
    data.url || '',
    data.userAgent || '',
    data.language || '',
    data.overall || '',
    data.priorityBlock || '',
    JSON.stringify(data.answersDetailed || data.answers || {}),
    JSON.stringify(data.blockResultsDetailed || data.blockResults || {})
  ];
  sheetRu.appendRow(rowRu);

  // 2) Лист по вопросам (развёрнуто)
  const sheetWide = ensureWideSheetAndHeaders_(data.answersDetailed || []);

  // Собираем строку: мета + ответы
  const meta = [
    data.timestamp || new Date().toISOString(),
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