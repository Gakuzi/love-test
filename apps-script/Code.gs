// ============================
// Конфигурация
// ============================

// ID вашей таблицы (из URL)
const SHEET_ID = '12PUk32kI3NmYPrjMh3BOc2RWsB070lQcfvsy0PCvNOs';

// Имя листа, куда писать результаты
const SHEET_NAME = 'Results';

// (Опционально) общий секрет для примитивной авторизации запросов
// Укажите любую строку и добавьте такую же в фронтенд (SHARED_TOKEN)
// Если не нужен — оставьте пустым ''
const SHARED_TOKEN = 'rk7GJ6QdZC3M5p9X2a8Vn0L4s1HfEwBt';

// Заголовки колонок (создадутся автоматически при первом запуске)
const HEADERS = [
  'timestamp',
  'userId',
  'invitedBy',
  'tag',
  'url',
  'userAgent',
  'language',
  'answers_json',
  'blockResults_json'
];

// ============================
// Вспомогательные функции
// ============================

function parseJsonSafe(str) {
  try { return JSON.parse(str); } catch (e) { return null; }
}

function ensureSheetAndHeader() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  const lastCol = sheet.getLastColumn();
  if (lastCol === 0) {
    // Пустой лист — создаём заголовки
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  } else {
    // Проверяем заголовки
    const currentHeaders = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
    const same = HEADERS.join('|') === currentHeaders.join('|');
    if (!same) {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
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

  // Простейшая проверка общего секрета
  if (SHARED_TOKEN && data.token !== SHARED_TOKEN) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = ensureSheetAndHeader();

  const {
    timestamp,
    userId,
    invitedBy,
    tag,
    url,
    userAgent,
    language,
    answers,
    blockResults
  } = data;

  const answersJson = JSON.stringify(answers || {});
  const blocksJson = JSON.stringify(blockResults || {});
  const row = [
    timestamp || new Date().toISOString(),
    userId || '',
    invitedBy || '',
    tag || '',
    url || '',
    userAgent || '',
    language || '',
    answersJson,
    blocksJson
  ];

  sheet.appendRow(row);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Для проверки доступности (GET /exec)
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: 'relationship-test-sink' }))
    .setMimeType(ContentService.MimeType.JSON);
}