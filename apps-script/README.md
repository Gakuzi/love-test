# Google Apps Script (Google Sheets Sink)

Эта папка содержит код (`Code.gs`) и манифест (`appsscript.json`) для веб‑приложения Google Apps Script, которое принимает результаты опроса и записывает их в Google Sheets.

## Что делает
- Принимает POST (Content-Type: text/plain, JSON в теле)
- Поля: `timestamp, userId, invitedBy, tag, url, userAgent, language, answers, blockResults`
- Создаёт лист `Results` (если нет) и добавляет строку с данными

## Быстрый запуск через UI (без clasp)
1. Откройте Google Sheets с нужной таблицей (ID уже прописан в `Code.gs`).
2. Extensions → Apps Script → вставьте содержимое `Code.gs`.
3. Deploy → New deployment → Type: Web app:
   - Execute as: Me
   - Who has access: Anyone
4. Скопируйте Web App URL и укажите его во фронтенде.

## Синхронизация с репозиторием через clasp

### Установка
```
npm i -g @google/clasp
clasp login
# Если уже залогинены, но push ругается на токен → выполните повторный логин:
clasp logout && clasp login
```

### Привязка к существующему скрипту
1. В Apps Script: Project Settings → скопируйте Script ID
2. В этой папке `apps-script/` создайте `.clasp.json` вида:
```json
{
  "scriptId": "ВАШ_SCRIPT_ID",
  "rootDir": "./"
}
```
3. Залить код:
Важно: команда выполняется из КОРНЯ проекта. Правильный абсолютный путь:
```
cd "/Users/evgeniy/Мой диск/Web application development/Тест на совместимость/love-test/apps-script"
clasp push --force
```
4. Деплой:
```
npx clasp deploy
```

### Создание нового скрипта из репозитория
```
cd love-test/apps-script
clasp create --title "Relationship Test Results" --type standalone
clasp push
```
После этого задеплойте как Web App в UI и укажите доступ: Anyone.

## Переменные
- В `Code.gs` можно задать `SHARED_TOKEN` для простой авторизации (добавьте тот же токен во фронтенд).
- `SHEET_ID` уже указан: 12PUk32kI3NmYPrjMh3BOc2RWsB070lQcfvsy0PCvNOs

## Тестирование
- GET запрос к Web App URL вернёт `{ ok: true }` (doGet)
- POST c `text/plain` и JSON‑телом добавит строку в лист `Results`