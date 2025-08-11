// Configuration
const AUTO_ADVANCE = true; // Автопереход к следующему вопросу после выбора ответа
const TEST_URL = window.location.href;
// Управление серверной синхронизацией (Apps Script)
const ENABLE_SERVER_SYNC = true;

function isServerSyncEnabled() {
  try {
    const params = new URLSearchParams(location.search);
    if (params.get('noserver') === '1') return false;
  } catch (_) {}
  return ENABLE_SERVER_SYNC;
}

function safePostToServer(payload) {
  if (!isServerSyncEnabled()) return;
  try {
    fetch(GOOGLE_SHEETS_WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload)
    }).catch(() => {});
  } catch (_) {}
}
// Загрузка конфигурации с сервера (Apps Script)
async function fetchConfig() {
  try {
    const url = new URL(GOOGLE_SHEETS_WEBAPP_URL);
    url.searchParams.set('action', 'config');
    const res = await fetch(url.toString());
    const data = await res.json();
    if (data && data.ok) {
      if (data.config) {
        const prev = JSON.parse(localStorage.getItem('testConfig') || 'null');
        const prevVer = prev && prev.version ? Number(prev.version) : 0;
        const newVer = data.config.version ? Number(data.config.version) : 0;
        if (!prev || newVer >= prevVer) {
          localStorage.setItem('testConfig', JSON.stringify(data.config));
        }
      }
      if (data.recommendations) localStorage.setItem('testRecommendations', JSON.stringify(data.recommendations));
      if (data.plan) localStorage.setItem('testPlan', JSON.stringify(data.plan));
      return data.config || null;
    }
  } catch (e) { console.warn('fetchConfig error', e); }
  return null;
}

async function seedSheets() {
  try {
    const url = new URL(GOOGLE_SHEETS_WEBAPP_URL);
    url.searchParams.set('action', 'init');
    url.searchParams.set('token', SHARED_TOKEN);
    const res = await fetch(url.toString());
    const data = await res.json();
    console.log('Инициализация таблиц:', data);
    if (data && data.ok) {
      // После инициализации повторно грузим конфиг
      await fetchConfig();
      alert('Таблицы успешно инициализированы. Конфигурация обновлена.');
    } else {
      alert('Не удалось инициализировать таблицы: ' + (data && data.error ? data.error : 'ошибка'));
    }
  } catch (e) {
    console.warn('seedSheets error', e);
    alert('Ошибка инициализации таблиц. Подробности в консоли.');
  }
}
// External integrations (from cursor branch)
const GOOGLE_SHEETS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbztWCE72POOwC8pPx595xgS8aPVwvaU3btijvNFvwHE9mcccYMo3P6NfTXc-qaAcptWGA/exec';
const SHARED_TOKEN = 'AKfycbztWCE72POOwC8pPx595xgS8aPVwvaU3btijvNFvwHE9mcccYMo3P6NfTXc-qaAcptWGA';



const DEFAULT_QUESTIONS = [
  // Block 1: Safety & Boundaries
  { id: 1, block: 'Безопасность', blockIndex: 0, text: 'Могу ли я спокойно сказать «нет» партнёру, не опасаясь последствий или конфликтов?', options: [ { value: 3, label: 'Да' }, { value: 2, label: 'Скорее да' }, { value: 1, label: 'Скорее нет' }, { value: 0, label: 'Нет' } ], hint: 'Речь идёт о том, чувствуете ли вы, что можете отказывать в чём-либо — в близости, в помощи, в совместных планах — и при этом не столкнётесь с обидой, молчанием, упрёками или эмоциональным шантажом. Например: если вы устали и скажете «не хочу идти на вечеринку», партнёр спокойно примет это или начнёт давить?' },
  { id: 2, block: 'Безопасность', blockIndex: 0, text: 'Уважает ли партнёр моё личное пространство, когда я прошу об этом?', options: [ { value: 3, label: 'Да' }, { value: 2, label: 'Скорее да' }, { value: 1, label: 'Скорее нет' }, { value: 0, label: 'Нет' } ], hint: 'Личное пространство — это не только физическое (время наедине, хобби), но и психологическое (возможность побыть в тишине, не отчитываться за каждый шаг). Если вы говорите: «Мне нужно побыть одной/одному», партнёр уважает это или проявляет ревность, тревогу, обвиняет в отстранении?' },
  { id: 3, block: 'Безопасность', blockIndex: 0, text: 'Чувствую ли я, что могу быть собой рядом с партнёром, без масок и напряжения?', options: [ { value: 3, label: 'Да' }, { value: 2, label: 'Скорее да' }, { value: 1, label: 'Скорее нет' }, { value: 0, label: 'Нет' } ], hint: 'Вы можете плакать, молчать, быть не в духе, говорить о своих страхах — и при этом не бояться, что вас осудят, посчитают «слабым» или «неинтересным»? Или вы чувствуете, что должны быть «в форме», чтобы вас любили?' },
  { id: 4, block: 'Безопасность', blockIndex: 0, text: 'Испытываю ли я уважение к своим эмоциям со стороны партнёра?', options: [ { value: 3, label: 'Да' }, { value: 2, label: 'Скорее да' }, { value: 1, label: 'Скорее нет' }, { value: 0, label: 'Нет' } ], hint: 'Когда вы говорите: «Мне грустно», «Я злюсь», «Мне неудобно» — партнёр пытается понять, поддерживает, не обесценивает ли ваши чувства? Например, не говорит ли: «Да брось, это ерунда» или «Ты слишком остро реагируешь»?' },
  { id: 5, block: 'Безопасность', blockIndex: 0, text: 'Есть ли в наших отношениях признаки давления: крики, молчание «в наказание», шантаж, манипуляции?', options: [ { value: 0, label: 'Да' }, { value: 1, label: 'Скорее да' }, { value: 2, label: 'Скорее нет' }, { value: 3, label: 'Нет' } ], hint: 'Обратите внимание: крик, игнорирование, угрозы (явные или скрытые: «Если ты уйдёшь — я сломаюсь»), манипуляции вины («После всего, что я для тебя сделал…»). Даже редкие случаи — сигнал. Ответ «Нет» означает, что таких проявлений нет вообще.' },
  // Block 2: Reliability & Partnership
  { id: 6, block: 'Надёжность', blockIndex: 1, text: 'Выполняет ли партнёр свои обещания, даже мелкие?', options: [ { value: 3, label: 'Да' }, { value: 2, label: 'Скорее да' }, { value: 1, label: 'Скорее нет' }, { value: 0, label: 'Нет' } ], hint: 'Речь не только о крупных обещаниях («купим дом»), но и о бытовых: «куплю хлеб», «позвоню твоим родителям», «приду вовремя». Если партнёр систематически забывает или откладывает — это снижает доверие и чувство опоры.' },
  { id: 7, block: 'Надёжность', blockIndex: 1, text: 'Чувствую ли я, что мы в одной команде, особенно в сложные моменты?', options: [ { value: 3, label: 'Да' }, { value: 2, label: 'Скорее да' }, { value: 1, label: 'Скорее нет' }, { value: 0, label: 'Нет' } ], hint: 'В кризис (болезнь, потеря работы, конфликт с родителями) вы чувствуете поддержку? Или остаётесь наедине с проблемой, а партнёр отстраняется, критикует, перекладывает ответственность?' },
  { id: 8, block: 'Надёжность', blockIndex: 1, text: 'Разделены ли между нами бытовые и финансовые обязанности честно и понятно?', options: [ { value: 3, label: 'Да' }, { value: 2, label: 'Скорее да' }, { value: 1, label: 'Скорее нет' }, { value: 0, label: 'Нет' } ], hint: 'Деление обязанностей не обязательно 50/50, но должно быть справедливым и обсуждаемым. Например, один больше зарабатывает — другой больше времени уделяет дому. Главное — отсутствие чувства эксплуатации и ясность: кто за что отвечает.' },
  { id: 9, block: 'Надёжность', blockIndex: 1, text: 'Можем ли мы говорить о деньгах без скандалов и обвинений?', options: [ { value: 3, label: 'Да' }, { value: 2, label: 'Скорее да' }, { value: 1, label: 'Скорее нет' }, { value: 0, label: 'Нет' } ], hint: 'Тема денег — одна из самых острых. Если обсуждение бюджета, трат, долгов вызывает крики, обвинения, молчание — это признак тревоги. Зрелый диалог: «Давай посмотрим, где можно сократить», а не «Ты всегда тратишь больше!»' },
  { id: 10, block: 'Надёжность', blockIndex: 1, text: 'Является ли партнёр предсказуемым в вопросах времени, ресурсов, обязательств?', options: [ { value: 3, label: 'Да' }, { value: 2, label: 'Скорее да' }, { value: 1, label: 'Скорее нет' }, { value: 0, label: 'Нет' } ], hint: 'Предсказуемость — это когда вы знаете, чего ожидать: вернётся ли он с работы вовремя, будет ли свободен в выходные, выполнит ли обещанное. Частые срывы планов, непостоянство создают тревожность и нестабильность.' },
  // Block 3: Connection & Emotions
  { id: 11, block: 'Связь', blockIndex: 2, text: 'Есть ли в наших отношениях ежедневные ритуалы внимания (объятие, поцелуй, «как день прошёл?»)?', options: [ { value: 3, label: 'Да' }, { value: 2, label: 'Скорее да' }, { value: 1, label: 'Скорее нет' }, { value: 0, label: 'Нет' } ], hint: 'Ритуалы — это маленькие, но регулярные проявления заботы: утреннее «доброе утро», вечернее «как прошёл день?», объятие при встрече. Они поддерживают связь, даже когда нет времени на глубокие разговоры.' },
  { id: 12, block: 'Связь', blockIndex: 2, text: 'Можем ли мы делиться своими чувствами, а не только обсуждать дела и быт?', options: [ { value: 3, label: 'Да' }, { value: 2, label: 'Скорее да' }, { value: 1, label: 'Скорее нет' }, { value: 0, label: 'Нет' } ], hint: 'Разговоры о чувствах — это не «надо купить молоко», а «мне было обидно, когда ты опоздал». Если вы говорите только о делах, дети, быт — эмоциональная связь ослабевает.' },
  { id: 13, block: 'Связь', blockIndex: 2, text: 'Чувствую ли я, что партнёр меня слышит и понимает?', options: [ { value: 3, label: 'Да' }, { value: 2, label: 'Скорее да' }, { value: 1, label: 'Скорее нет' }, { value: 0, label: 'Нет' } ], hint: 'Слышать — это не просто «я слышу слова», а «я чувствую, что ты понимаешь, что я переживаю». Партнёр не перебивает, не спешит с советами, не обесценивает. Он может сказать: «Тебе было тяжело, я понимаю».' },
  { id: 14, block: 'Связь', blockIndex: 2, text: 'Умеем ли мы мириться и признавать свои ошибки после конфликта?', options: [ { value: 3, label: 'Да' }, { value: 2, label: 'Скорее да' }, { value: 1, label: 'Скорее нет' }, { value: 0, label: 'Нет' } ], hint: 'Конфликты бывают у всех. Важно, что происходит после: идёт ли диалог, признание своей части в конфликте, извинение? Или всё заканчивается молчанием, обидами, «забыли, но не простили»?' },
  { id: 15, block: 'Связь', blockIndex: 2, text: 'Комфортно ли нам быть вдвоём без отвлечений — телефонов, дел, посторонних?', options: [ { value: 3, label: 'Да' }, { value: 2, label: 'Скорее да' }, { value: 1, label: 'Скорее нет' }, { value: 0, label: 'Нет' } ], hint: 'Можете ли вы провести вечер или утро вдвоём, не включая ТВ, не проверяя телефоны, не приглашая гостей? Это показатель качества близости: вы наслаждаетесь обществом друг друга, а не просто «живёте под одной крышей».' },
  // Block 4: Growth & Values
  { id: 16, block: 'Рост', blockIndex: 3, text: 'Обсуждали ли мы взгляды друг друга на ключевые темы (деньги, верность, дети, работа)?', options: [ { value: 3, label: 'Да' }, { value: 2, label: 'Скорее да' }, { value: 1, label: 'Скорее нет' }, { value: 0, label: 'Нет' } ], hint: 'Речь о глубоких ценностях. Например: как вы относитесь к верности? Что важнее — карьера или семья? Хотите ли детей? Как распределять финансы? Если эти темы не обсуждались — есть риск столкновения взглядов в будущем.' },
  { id: 17, block: 'Рост', blockIndex: 3, text: 'Есть ли у нас общие цели на будущее, которые мы реально обсуждали?', options: [ { value: 3, label: 'Да' }, { value: 2, label: 'Скорее да' }, { value: 1, label: 'Скорее нет' }, { value: 0, label: 'Нет' } ], hint: 'Общие цели — это не просто «жить вместе», а конкретные планы: «через год поедем в Италию», «через пять лет купим дом», «выйдем на пенсию пораньше». Главное — чтобы вы обсуждали это вместе и были на одной волне.' },
  { id: 18, block: 'Рост', blockIndex: 3, text: 'Эти отношения помогают мне становиться лучшей версией себя?', options: [ { value: 3, label: 'Да' }, { value: 2, label: 'Скорее да' }, { value: 1, label: 'Скорее нет' }, { value: 0, label: 'Нет' } ], hint: 'В зрелых отношениях вы чувствуете, что растёте: становитесь добрее, увереннее, осознаннее. Если же вы чувствуете, что «теряете себя», становитесь тревожнее, зависимее — это тревожный сигнал.' },
  { id: 19, block: 'Рост', blockIndex: 3, text: 'Чувствую ли я, что могу развиваться, а не только адаптироваться?', options: [ { value: 3, label: 'Да' }, { value: 2, label: 'Скорее да' }, { value: 1, label: 'Скорее нет' }, { value: 0, label: 'Нет' } ], hint: 'Развитие — это возможность учиться, меняться, пробовать новое. Адаптация — это «притворяться, чтобы не конфликтовать». Если вы чувствуете, что гнетётесь под ожиданиями — это признак дисбаланса.' },
  { id: 20, block: 'Рост', blockIndex: 3, text: 'Уважаю ли я партнёра, даже если мы не согласны или в конфликте?', options: [ { value: 3, label: 'Да' }, { value: 2, label: 'Скорее да' }, { value: 1, label: 'Скорее нет' }, { value: 0, label: 'Нет' } ], hint: 'Уважение — это когда вы можете спорить, но не переходить на личности, не смотреть свысока, не обесценивать. Даже в гневе вы видите в партнёре достойного человека, с которым можно диалог.' }
];

let QUESTIONS = DEFAULT_QUESTIONS.slice();

// App state
let currentState = {
  currentQuestionIndex: 0,
  answers: {},
  blockResults: { 0: null, 1: null, 2: null, 3: null },
  userName: ''
};

// Глобальный флаг старта анимации загрузки (чтобы не запускать дважды)
let loadingAnimationStarted = false;
// Init
window.addEventListener('DOMContentLoaded', () => {
  // Accessibility roles
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-valuemin', '0');
    progressBar.setAttribute('aria-valuemax', '100');
  }

  // Принудительно используем светлую тему для читаемости
  try {
    document.documentElement.classList.add('force-light');
    document.documentElement.style.colorScheme = 'light';
  } catch (_) {}

  // Anonymous id (from cursor branch)
  try { userId = getOrCreateUserId(); } catch (_) {}

  // Инициализация приложения — сразу, без ожидания сети
  initializeApp();
  // Загрузка конфигурации — параллельно, без блокировки старта
  fetchConfig().then(cfg => {
    try {
      if (cfg && Array.isArray(cfg.questions) && cfg.questions.length) {
        QUESTIONS = cfg.questions;
        // Если на экране вопросы — мягко обновим текущий вопрос
        if (document.getElementById('questionCard')?.style.display === 'block') {
          showQuestion(currentState.currentQuestionIndex || 0);
        }
      }
    } catch (e) { console.warn('apply config failed', e); }
  }).catch(() => {});
  // Первичный лог просмотра заставки/интро
  try { safePostToServer({ token: SHARED_TOKEN, userId, ref: 'intro', event: 'view_intro' }); } catch (_) {}
  
  // Свайп-навигация (влево — далее, вправо — назад) на экране вопросов
  initSwipeNavigation();

  // Страховка: кнопка финала всегда переходит к результатам
  document.addEventListener('click', (e) => {
    const finalBtn = e.target.closest('.btn-final');
    if (finalBtn) {
      e.preventDefault();
      // Если ответ на последний вопрос выбран — показываем результаты,
      // иначе стандартная логика nextQuestion покажет модалку об ошибке
      nextQuestion();
    }
  });

  loadState();
  updateProgress();

  if (currentState.currentQuestionIndex > 0) {
    showQuestion(currentState.currentQuestionIndex);
  }
  
  // Запускаем анимированную загрузку с небольшой задержкой
  console.log('Запуск анимации загрузки через 500мс...');
  setTimeout(() => {
    startLoadingAnimation();
  }, 500);

  // Админ-инициализация таблиц (по параметру seed=1 в URL)
  try {
    const seedFlag = new URLSearchParams(location.search).get('seed');
    if (seedFlag === '1') {
      seedSheets();
    }
  } catch (_) {}
});

// Инициализация поля имени пользователя
function initUserNameInput() {
  console.log('Инициализация поля имени...');
  
  const userNameInput = document.getElementById('userName');
  const startButton = document.getElementById('startTestBtn');
  
  console.log('Элементы формы:', { userNameInput, startButton });
  
  if (!userNameInput || !startButton) {
    console.error('Элементы формы имени не найдены');
    return;
  }
  
  // Загружаем сохраненное имя
  userNameInput.value = currentState.userName || '';
  console.log('Имя загружено:', currentState.userName);
  
  updateStartButtonState();
  
  // Обработчик ввода
  userNameInput.addEventListener('input', (e) => {
    currentState.userName = e.target.value.trim();
    console.log('Имя обновлено:', currentState.userName);
    updateStartButtonState();
    saveState();
    updatePersonalizationUI();
  });
  
  // Обработчик Enter
  userNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && currentState.userName) {
      startTest();
    }
  });
  
  console.log('Поле имени инициализировано');
}

// Обновление состояния кнопки старта
function updateStartButtonState() {
  const startButton = document.getElementById('startTestBtn');
  if (!startButton) {
    console.error('Кнопка старта не найдена');
    return;
  }
  
  const hasName = currentState.userName && currentState.userName.trim().length > 0;
  startButton.disabled = !hasName;
  
  // Визуальная индикация
  if (hasName) {
    startButton.classList.remove('disabled');
    startButton.classList.add('enabled');
  } else {
    startButton.classList.add('disabled');
    startButton.classList.remove('enabled');
  }
}

function initSwipeNavigation() {
  let touchStartX = null;
  let touchStartY = null;
  const threshold = 50; // минимальная горизонтальная дистанция свайпа

  const isQuestionView = () => {
    const card = document.getElementById('questionCard');
    return card && card.style.display === 'block';
  };

  document.addEventListener('touchstart', (e) => {
    if (!isQuestionView()) return;
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (!isQuestionView() || touchStartX === null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = Math.abs(t.clientY - touchStartY);
    // Игнорируем почти вертикальные жесты
    if (Math.abs(dx) < threshold || dy > 80) {
      touchStartX = null; touchStartY = null; return;
    }
    if (dx < 0) {
      // влево — следующий вопрос (если ответ выбран, nextQuestion() выполнит переход)
      nextQuestion();
    } else {
      // вправо — назад
      prevQuestion();
    }
    touchStartX = null; touchStartY = null;
  }, { passive: true });
}

// State helpers
function saveState() {
  try { localStorage.setItem('loveTestState', JSON.stringify(currentState)); } catch (_) {}
}

function loadState() {
  const savedState = localStorage.getItem('loveTestState');
  if (!savedState) return;
  try {
    const parsed = JSON.parse(savedState);
    if (
      parsed &&
      parsed.currentQuestionIndex >= 0 && parsed.currentQuestionIndex <= 20 &&
      typeof parsed.answers === 'object'
    ) {
      currentState = parsed;
    }
  } catch (e) { console.error('Ошибка при загрузке состояния:', e); }
}

function clearState() {
  try { localStorage.removeItem('loveTestState'); } catch (_) {}
  currentState = { currentQuestionIndex: 0, answers: {}, blockResults: { 0: null, 1: null, 2: null, 3: null } };
}

// UI controls
function startTest() {
  // Сохраняем имя пользователя
  const userNameInput = document.getElementById('userName');
  if (userNameInput) {
    currentState.userName = userNameInput.value.trim();
    saveState();
  }
  
  // Скрываем введение и показываем первый вопрос
  document.getElementById('intro').style.display = 'none';
  document.querySelector('.progress-container').style.display = 'block';
  
  // Сбрасываем состояние теста
  currentState.currentQuestionIndex = 0;
  currentState.answers = {};
  currentState.blockResults = { 0: null, 1: null, 2: null, 3: null };
  
  // Показываем первый вопрос
  showQuestion(0);
  
  // Обновляем прогресс
  updateProgress();
  
  // Плавно прокручиваем к верху
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Лог: начало теста
  try { safePostToServer({ token: SHARED_TOKEN, userId, ref: 'start', event: 'start_test', eventPayload: { userName: (currentState.userName||'') } }); } catch (_) {}
}

function showQuestion(index) {
  const question = QUESTIONS[index];
  const card = document.getElementById('questionCard');
  const optionsContainer = document.getElementById('optionsContainer');
  const nextBtn = document.getElementById('nextBtn');

  // Очищаем состояние кнопки перед обновлением
  if (nextBtn) {
    nextBtn.disabled = false;
    nextBtn.classList.remove('disabled');
  }

  card.style.display = 'block';
  document.getElementById('blockTag').textContent = question.block;
  document.getElementById('questionNumber').textContent = `Вопрос ${index % 5 + 1} из 5`;
  document.getElementById('questionText').textContent = question.text;
  updatePersonalizationUI();
  // Лог: показ вопроса
  try { safePostToServer({ token: SHARED_TOKEN, userId, ref: `q-${index+1}`, event: 'view_question', eventPayload: { index, block: question.block } }); } catch (_) {}
  
  // Кнопка "Далее" больше не используется при авто‑навигации — скрываем её
  if (nextBtn) {
    nextBtn.style.display = 'none';
  }
  
  // Обновляем хинт
  const hintContent = document.getElementById('hintContent');
  if (hintContent) {
    hintContent.textContent = question.hint;
    hintContent.classList.remove('show'); // Сворачиваем при переходе к новому вопросу
  }
  
  // Сбрасываем состояние кнопки пояснения
  const hintToggle = document.querySelector('.hint-toggle');
  if (hintToggle) {
    hintToggle.classList.remove('active');
    const hintLabel = hintToggle.querySelector('.hint-label');
    if (hintLabel) {
      hintLabel.textContent = 'Пояснение 📖';
    }
  }

  // Скрыть все промежуточные результаты
  for (let i = 1; i <= 4; i++) {
    const blockResult = document.getElementById(`blockResult${i}`);
    if (blockResult) blockResult.style.display = 'none';
  }
  
  // Скрыть финальные результаты
  const finalResults = document.getElementById('finalResults');
  if (finalResults) finalResults.style.display = 'none';

  optionsContainer.innerHTML = '';
  optionsContainer.setAttribute('role', 'radiogroup');
  
  // Принудительно устанавливаем grid стили
  optionsContainer.style.display = 'grid';
  optionsContainer.style.gridTemplateColumns = window.innerWidth <= 768 ? '1fr' : '1fr 1fr';
  optionsContainer.style.gap = '1rem';

  question.options.forEach((option) => {
    const optionElement = document.createElement('div');
    optionElement.className = 'option';
    optionElement.setAttribute('role', 'radio');
    optionElement.setAttribute('tabindex', '0');

    const inputId = `option-${index}-${option.value}`;
    const isSelected = currentState.answers[index] === option.value;
    if (isSelected) optionElement.classList.add('selected');

    optionElement.innerHTML = `
      <input type="radio" id="${inputId}" name="question-${index}" value="${option.value}" ${isSelected ? 'checked' : ''}>
      <label class="option-label" for="${inputId}">${option.label}</label>
    `;

    const selectThis = () => {
      // unselect others
      optionsContainer.querySelectorAll('.option').forEach((el) => {
        el.classList.remove('selected');
        el.setAttribute('aria-checked', 'false');
        const input = el.querySelector('input[type="radio"]');
        if (input) input.checked = false;
      });
      // select current
      optionElement.classList.add('selected');
      optionElement.setAttribute('aria-checked', 'true');
      const input = optionElement.querySelector('input[type="radio"]');
      if (input) input.checked = true;

      // Используем функцию selectOptionWithUpdate для автоматического сохранения
      selectOptionWithUpdate(index, option.value);

      // Автопереход к следующему вопросу для touch-friendly UX
      if (AUTO_ADVANCE) {
        setTimeout(() => {
          // Защита: не переходить, если мы уже на экране результатов блока
          const isShowingBlock = ((index + 1) % 5 === 0);
          if (!isShowingBlock) {
            nextQuestion();
          } else {
            // Если завершили блок — используем стандартную логику nextQuestion
            nextQuestion();
          }
        }, 120);
      }
    };

    optionElement.addEventListener('click', selectThis);
    optionElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectThis(); }
    });

    optionsContainer.appendChild(optionElement);
  });

  document.getElementById('prevBtn').style.display = index > 0 ? 'flex' : 'none';
  
  // Кнопка скрыта всегда, финал будет показан автоматически

  currentState.currentQuestionIndex = index;
  updateProgress();
  updateButtonStates();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleHint() {
  const hintContent = document.getElementById('hintContent');
  const toggleButton = document.querySelector('.hint-toggle');
  const hintLabel = toggleButton?.querySelector('.hint-label');
  
  if (hintContent) {
    hintContent.classList.toggle('show');
    
    if (toggleButton) {
      toggleButton.classList.toggle('active');
    }
    
    if (hintLabel) {
      if (hintContent.classList.contains('show')) {
        hintLabel.textContent = 'Скрыть 📖';
      } else {
        hintLabel.textContent = 'Пояснение 📖';
      }
    }
  }
}

function updateProgress() {
  const progress = (currentState.currentQuestionIndex / 20) * 100;
  const bar = document.getElementById('progressBar');
  bar.style.width = `${progress}%`;
  bar.setAttribute('aria-valuenow', String(Math.round(progress)));
}

function nextQuestion() {
  const answer = currentState.answers[currentState.currentQuestionIndex];
  // Автонавигация: если ответ не выбран, просто ничего не делаем (без модалок)
  if (answer === undefined) { return; }

  const currentIndex = currentState.currentQuestionIndex;
  
  // Если это последний вопрос (индекс 19)
  if (currentIndex === 19) {
    // Обновляем индекс для последнего вопроса
    currentState.currentQuestionIndex = 20;
    saveState();
    
    // Рассчитываем последний блок и показываем финальные результаты
    const blockIndex = Math.floor(currentIndex / 5);
    calculateBlockResult(blockIndex);
    showFinalResults();
    return;
  }
  
  // Проверяем, завершили ли мы блок (5 вопросов)
  if ((currentIndex + 1) % 5 === 0) {
    // ВАЖНО: Сначала обновляем индекс, потом показываем блок
    currentState.currentQuestionIndex = currentIndex + 1;
    saveState();
    
    const blockIndex = Math.floor(currentIndex / 5);
    calculateBlockResult(blockIndex);
    showCompactBlockResult(blockIndex);
    // Останавливаемся на результатах блока - пользователь нажмёт "Продолжить"
    return;
  }
  
  // Обновляем индекс и переходим к следующему вопросу
  currentState.currentQuestionIndex = currentIndex + 1;
  saveState();
  showQuestion(currentState.currentQuestionIndex);
}

function prevQuestion() {
  if (currentState.currentQuestionIndex > 0) {
    // Обновляем индекс и переходим к предыдущему вопросу
    currentState.currentQuestionIndex = currentState.currentQuestionIndex - 1;
    saveState();
    showQuestion(currentState.currentQuestionIndex);
    // Лог: возврат к вопросу
    try { safePostToServer({ token: SHARED_TOKEN, userId, ref: `q-${currentState.currentQuestionIndex+1}`, event: 'return_question', eventPayload: { index: currentState.currentQuestionIndex } }); } catch (_) {}
    
    // Обновляем компактные блоки результатов
    updateCompactBlocks();
  }
}

// Показываем компактный блок результата
function showCompactBlockResult(blockIndex) {
  const blockNumber = blockIndex + 1;
  const compactBlock = document.getElementById(`blockResult${blockNumber}`);
  // Лог: показ сводки блока
  try { safePostToServer({ token: SHARED_TOKEN, userId, ref: `block-${blockNumber}`, event: 'view_block_summary', eventPayload: { blockIndex, blockNumber } }); } catch (_) {}
  
  // Скрываем карточку вопроса
  document.getElementById('questionCard').style.display = 'none';
  
  // Показываем контейнер с вопросами
  document.getElementById('question-container').style.display = 'block';
  
  if (compactBlock) {
    compactBlock.style.display = 'block';
    
    // Обновляем информацию в компактном блоке
    updateCompactBlockInfo(blockIndex);

    // Разворачиваем детали по умолчанию, чтобы явно показать промежуточный результат
    const detailsEl = document.getElementById(`details-${blockNumber}`);
    if (detailsEl) {
      detailsEl.classList.add('expanded');
    }
    const toggleIcon = document.getElementById(`toggle-${blockNumber}`);
    if (toggleIcon) {
      toggleIcon.classList.add('expanded');
    }
    
    // Плавно прокручиваем к верху
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  }
}

// Обновляем информацию в компактном блоке
function updateCompactBlockInfo(blockIndex) {
  const blockNumber = blockIndex + 1;
  const result = currentState.blockResults[blockIndex];
  if (!result) return;
  
  // Обновляем скор
  const scoreElement = document.querySelector(`#blockResult${blockNumber} .score-badge`);
  if (scoreElement) {
    scoreElement.textContent = `${result.sum} баллов`;
    scoreElement.className = `score-badge score-${result.zone}`;
  }
  
  // Обновляем зону
  const zoneElement = document.querySelector(`#blockResult${blockNumber} .zone-mini`);
  if (zoneElement) {
    zoneElement.className = `zone-mini zone-${result.zone}`;
    const zoneTexts = { success: 'Зона силы', warning: 'Зона риска', danger: 'Зона тревоги' };
    zoneElement.textContent = zoneTexts[result.zone];
  }
}

// Обновляем все компактные блоки
function updateCompactBlocks() {
  for (let i = 0; i < 4; i++) {
    if (currentState.blockResults[i]) {
      updateCompactBlockInfo(i);
    }
  }
}

function showBlockResult(blockNumber) {
  document.getElementById('questionCard').style.display = 'none';
  for (let i = 1; i <= 4; i++) {
    const node = document.getElementById(`blockResult${i}`);
    if (node) node.style.display = 'none';
  }
  document.getElementById(`blockResult${blockNumber}`).style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function calculateBlockResult(blockIndex) {
  const start = blockIndex * 5;
  const end = start + 5;
  let sum = 0;
  for (let i = start; i < end; i++) sum += currentState.answers[i] || 0;

  currentState.blockResults[blockIndex] = {
    sum,
    zone: sum >= 11 ? 'success' : sum >= 6 ? 'warning' : 'danger'
  };

  // Обновляем карточку промежуточного результата
  try { renderBlockSummary(blockIndex); } catch (e) { console.warn('renderBlockSummary failed', e); }

  // Безопасное обновление старого виджета круглого счётчика, если он присутствует в шаблоне
  const scoreElement = document.getElementById(`block${blockIndex + 1}Score`);
  if (scoreElement) {
    const percentage = (sum / 15) * 100;
    const color = {
      success: 'var(--success)',
      warning: 'var(--warning)',
      danger: 'var(--danger)'
    }[currentState.blockResults[blockIndex].zone];

    scoreElement.style.background = `conic-gradient(${color} ${percentage}%, #e0e4e8 ${percentage}%)`;
    const scoreText = scoreElement.querySelector('.score-text');
    if (scoreText) scoreText.textContent = `${sum}/15`;

    const zoneLabel = scoreElement.nextElementSibling;
    if (zoneLabel) {
      zoneLabel.className = `zone-label zone-${currentState.blockResults[blockIndex].zone}`;
      zoneLabel.textContent = {
        success: 'Зона силы',
        warning: 'Зона риска',
        danger: 'Зона тревоги'
      }[currentState.blockResults[blockIndex].zone];
    }
  }
}

function getRecommendationsFor(blockIndex, zone) {
  try {
    const raw = localStorage.getItem('testRecommendations');
    if (!raw) return [];
    const map = JSON.parse(raw);
    const blockMap = map[String(blockIndex)] || map[blockIndex] || {};
    const items = blockMap[zone] || [];
    return Array.isArray(items) ? items : [];
  } catch { return []; }
}

function renderBlockSummary(blockIndex) {
  const humanIndex = blockIndex + 1;
  const res = currentState.blockResults[blockIndex];
  if (!res) return;
  const scoreEl = document.getElementById(`score${humanIndex}`);
  const zoneEl = document.getElementById(`zone${humanIndex}`);
  if (scoreEl) scoreEl.textContent = `${res.sum} баллов`;
  if (zoneEl) {
    zoneEl.textContent = res.zone === 'success' ? 'Зона силы' : res.zone === 'warning' ? 'Зона роста' : 'Зона тревоги';
    zoneEl.className = `zone-mini zone-${res.zone}`;
  }
  const details = document.getElementById(`details-${humanIndex}`);
  if (details) {
    const recos = getRecommendationsFor(blockIndex, res.zone);
    const wrapper = details.querySelector('.recommendations');
    if (wrapper) {
      const ul = wrapper.querySelector('ul') || document.createElement('ul');
      ul.innerHTML = '';
      recos.slice(0, 3).forEach((r, idx) => {
        const li = document.createElement('li');
        li.textContent = r && r.text ? r.text : (r && r.title ? r.title : 'Рекомендация');
        li.addEventListener('click', () => {
          try { safePostToServer({ token: SHARED_TOKEN, userId, ref: 'block-summary', event: 'click_recommendation', eventPayload: { blockIndex, index: idx, title: r?.title || '', text: r?.text || '' } }); } catch (_) {}
        });
        ul.appendChild(li);
      });
      if (!wrapper.contains(ul)) wrapper.appendChild(ul);
    }
  }
}

function renderFinalRecommendations() {
  for (let bi = 0; bi < 4; bi++) {
    const res = currentState.blockResults[bi];
    if (!res) continue;
    const humanIndex = bi + 1;
    const descEl = document.getElementById(`blockDescription${humanIndex}`);
    if (!descEl) continue;
    let recosWrap = descEl.parentElement && descEl.parentElement.querySelector ? descEl.parentElement.querySelector('.block-recos') : null;
    if (!recosWrap) {
      recosWrap = document.createElement('div');
      recosWrap.className = 'block-recos';
      if (descEl.parentElement) descEl.parentElement.appendChild(recosWrap);
    }
    const recos = getRecommendationsFor(bi, res.zone);
    const ul = document.createElement('ul');
    ul.className = 'recos-list';
    recos.slice(0, 3).forEach((r, idx) => {
      const li = document.createElement('li');
      li.textContent = r && r.text ? r.text : (r && r.title ? r.title : 'Рекомендация');
      li.addEventListener('click', () => { try { safePostToServer({ token: SHARED_TOKEN, userId, ref: 'final-results', event: 'click_recommendation', eventPayload: { blockIndex: bi, index: idx, title: r?.title || '', text: r?.text || '' } }); } catch (_) {} });
      ul.appendChild(li);
    });
    recosWrap.innerHTML = '';
    const title = document.createElement('h5');
    title.textContent = 'Рекомендации:';
    recosWrap.appendChild(title);
    recosWrap.appendChild(ul);
  }
}

function continueToBlock(blockNumber) {
  const questionIndex = (blockNumber - 1) * 5;
  showQuestion(questionIndex);
  // Лог: просмотр блока
  try { safePostToServer({ token: SHARED_TOKEN, userId, ref: `block-${blockNumber}`, event: 'view_block', eventPayload: { blockNumber } }); } catch (_) {}
}

function continueToNextBlock() {
  // Продолжаем к следующему вопросу после показа результатов блока
  const nextQuestionIndex = currentState.currentQuestionIndex;
  console.log(`continueToNextBlock: currentQuestionIndex=${nextQuestionIndex}, answers=`, currentState.answers);
  
  // Если достигли конца теста
  if (nextQuestionIndex >= 20) {
    showFinalResults();
    return;
  }
  
  // Скрываем все блоки результатов
  for (let i = 1; i <= 4; i++) {
    const blockResult = document.getElementById(`blockResult${i}`);
    if (blockResult) blockResult.style.display = 'none';
  }
  // Дополнительно скрываем любые блоки результатов из альтернативной разметки
  document.querySelectorAll('.block-result-compact, .block-result').forEach(el => {
    el.style.display = 'none';
  });
  
  // Скрываем контейнер с блоками результатов
  document.getElementById('question-container').style.display = 'none';
  
  // Принудительно обновляем DOM с задержкой
  setTimeout(() => {
    // Переходим к следующему вопросу (currentQuestionIndex уже правильный)
    showQuestion(nextQuestionIndex);
    
    // Показываем прогресс-бар
    document.querySelector('.progress-container').style.display = 'block';
  }, 50);
}

function reviewBlock(blockNumber) { continueToBlock(blockNumber); }

function showFinalResults() {
  // Полностью скрываем все элементы теста
  document.getElementById('intro').style.display = 'none';
  document.getElementById('questionCard').style.display = 'none';
  document.querySelector('.progress-container').style.display = 'none';
  
  // Скрываем все компактные блоки результатов (обе разметки: compact и legacy)
  for (let i = 1; i <= 4; i++) {
    const blockResult = document.getElementById(`blockResult${i}`);
    if (blockResult) blockResult.style.display = 'none';
  }
  document.querySelectorAll('.block-result-compact, .block-result').forEach(el => {
    el.style.display = 'none';
  });
  
  // Показываем контейнер результатов
  const resultsContainer = document.getElementById('results');
  if (resultsContainer) resultsContainer.style.display = 'block';

  // Показываем финальные результаты на всю страницу
  const finalResults = document.getElementById('finalResults');
  finalResults.style.display = 'block';
  finalResults.style.position = 'relative';
  finalResults.style.zIndex = '10';
  finalResults.style.background = '#f8f9fa';
  finalResults.style.minHeight = '100vh';
  finalResults.style.paddingTop = '2rem';
  
  try { calculateOverallResult(); } catch (e) { console.warn('calculateOverallResult skipped:', e); }
  try { renderFinalRecommendations(); } catch (e) { console.warn('renderFinalRecommendations failed:', e); }
  
  // Автоматически сохраняем финальные результаты
  autoSaveFinalResults();
  // Лог: завершение теста (показ итогов)
  try { safePostToServer({ token: SHARED_TOKEN, userId, ref: 'final-results', event: 'finish_test' }); } catch (_) {}
  
  // Плавный переход к результатам
  finalResults.style.opacity = '0';
  finalResults.style.transform = 'translateY(30px)';
  
  setTimeout(() => {
    finalResults.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    finalResults.style.opacity = '1';
    finalResults.style.transform = 'translateY(0)';
  }, 100);
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Автоматическое сохранение финальных результатов
async function autoSaveFinalResults() {
  try {
    // В data-driven режиме попробуем получить анализ с сервера
    let serverOverall = '';
    let serverPriority = '';
    try {
      const payloadAnalyze = { action: 'analyze', answers: currentState.answers, token: SHARED_TOKEN };
      await fetch(GOOGLE_SHEETS_WEBAPP_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payloadAnalyze) })
        .then(r=>r.json()).then(j=>{
          if (j && j.ok && j.analysis) {
            serverOverall = j.analysis.overall || '';
            serverPriority = j.analysis.priorityBlock || '';
          }
        });
    } catch (_) {}
    // Локальная подстраховка
    if (!serverOverall || !serverPriority) {
      calculateOverallResult();
    }
    const overall = serverOverall || (document.getElementById('overallStatus')?.textContent || '');
    const priority = serverPriority || (document.getElementById('priorityBlock')?.textContent || '');
    
    const payload = {
      token: SHARED_TOKEN || undefined,
      userName: currentState.userName || '',
      userId,
      invitedBy: getInvitedBy() || null,
      tag: 'final-results',
      ref: 'final-results',
      senderName: (currentState.userName || ''),
      recipientName: getInviterNameFromUrl() ? '' : '',
      utmSource: getUtmSource(),
      url: location.href,
      userAgent: navigator.userAgent,
      language: navigator.language,
      // YYYY-MM-DD HH:mm:ss в часовом поясе Москвы
      timestamp: (function(){
        const now = new Date();
        const moscowTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));
        const y = moscowTime.getFullYear();
        const m = String(moscowTime.getMonth()+1).padStart(2,'0');
        const d = String(moscowTime.getDate()).padStart(2,'0');
        const hh = String(moscowTime.getHours()).padStart(2,'0');
        const mm = String(moscowTime.getMinutes()).padStart(2,'0');
        const ss = String(moscowTime.getSeconds()).padStart(2,'0');
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
      })(),
      answersDetailed: buildDetailedAnswers(),
      blockResultsDetailed: buildBlockResultsDetailed(),
      overall,
      priorityBlock: priority,
      status: 'completed'
    };
    
    safePostToServer(payload);
    
    console.log('Финальные результаты автоматически сохранены');
  } catch (e) { 
    console.warn('Не удалось автоматически сохранить финальные результаты:', e); 
  }
}

function calculateOverallResult() {
  const total = Object.values(currentState.blockResults).reduce((sum, block) => sum + (block ? block.sum : 0), 0);
  const avg = total / 4;

  let overall = 'зрелые';
  if (avg < 8) overall = 'разрушительные';
  else if (avg < 11) overall = 'шаткие';
  const overallStatusEl = document.getElementById('overallStatus');
  if (overallStatusEl) overallStatusEl.textContent = overall;

  const lowestBlock = Object.entries(currentState.blockResults).reduce(
    (lowest, [index, block]) => {
      if (!block) return lowest;
      return block.sum < lowest.sum ? { index, sum: block.sum } : lowest;
    },
    { index: 0, sum: Infinity }
  );

  const blockNames = ['Безопасность', 'Надёжность', 'Связь', 'Рост'];
  const priorityBlockEl = document.getElementById('priorityBlock');
  if (priorityBlockEl && lowestBlock.index !== null) priorityBlockEl.textContent = blockNames[lowestBlock.index];

  // Обновляем мини‑график
  try {
    [1,2,3,4].forEach((n, i) => {
      const block = currentState.blockResults[i] || { sum: 0 };
      const fill = document.getElementById(`barFill${n}`);
      const val = document.getElementById(`barVal${n}`);
      const pct = Math.max(0, Math.min(100, (block.sum/25)*100));
      if (fill) {
        fill.style.width = `${pct}%`;
        // динамический цвет: 0-40 красный, 40-70 жёлтый, 70-100 зелёный
        let color = '#e57373';
        if (pct >= 70) color = '#66bb6a'; else if (pct >= 40) color = '#fbc02d';
        fill.style.background = `linear-gradient(90deg, ${color}, ${color})`;
      }
      if (val) val.textContent = `${block.sum||0}/25`;
    });
  } catch (_) {}

  // Делаем блоки в сетке сворачиваемыми
  try {
    const grid = document.getElementById('blocksGrid');
    if (grid) {
      grid.querySelectorAll('.block-summary').forEach((el) => {
        el.addEventListener('click', () => el.classList.toggle('expanded'));
      });
    }
  } catch (_) {}

  // PDF (если есть скрытый отчёт)
  const pdfDate = document.getElementById('pdfDate');
  if (pdfDate) pdfDate.textContent = `Дата: ${new Date().toLocaleDateString('ru-RU')}`;
  const pdfTableBody = document.getElementById('pdfTableBody');
  if (pdfTableBody) {
    pdfTableBody.innerHTML = '';
    blockNames.forEach((name, index) => {
      const block = currentState.blockResults[index];
      if (!block) return;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${name}</td>
        <td>${block.sum}/15</td>
        <td>${{ success: 'Зона силы', warning: 'Зона риска', danger: 'Зона тревоги' }[block.zone]}</td>
      `;
      pdfTableBody.appendChild(tr);
    });
  }
  const pdfSummary = document.getElementById('pdfSummary');
  if (pdfSummary) {
    pdfSummary.innerHTML = `
      <p><strong>Общее состояние:</strong> ${overall}</p>
      <p><strong>Приоритетный блок:</strong> ${blockNames[lowestBlock.index]}</p>
    `;
  }
  const pdfRecommendations = document.getElementById('pdfRecommendations');
  if (pdfRecommendations) {
    pdfRecommendations.innerHTML = `
      <h3>Приоритетные рекомендации</h3>
      <p>1. <strong>Работа с границами:</strong> Начните с малого - установите одну четкую границу и обсудите её с партнером.</p>
      <p>2. <strong>Укрепление связи:</strong> Внедрите ежедневный "ритуал конца дня" - 10 минут без телефонов и дел.</p>
      <p>3. <strong>Личностный рост:</strong> На этой неделе обсудите, что каждый из вас хочет развивать в себе.</p>
      <h3>Долгосрочные рекомендации</h3>
      <p>1. <strong>Через месяц:</strong> Составьте список ваших ожиданий друг от друга и обсудите их.</p>
      <p>2. <strong>Через три месяца:</strong> Создайте совместные цели на будущее и план их достижения.</p>
      <p>3. <strong>Долгосрочно:</strong> Регулярно проводите "проверки состояния отношений" раз в месяц.</p>
    `;
  }
}

function downloadPDF() { /* отключено */ }

function safeOpen(url) {
  const newWin = window.open(url, '_blank');
  if (newWin) newWin.opener = null;
}



function restartTest() {
  if (confirm('Вы уверены, что хотите начать тест заново? Все ваши ответы будут потеряны.')) {
    clearState();
    document.getElementById('finalResults').style.display = 'none';
    document.getElementById('intro').style.display = 'block';
    updateProgress();
    try { safePostToServer({ token: SHARED_TOKEN, userId, ref: 'restart', event: 'restart_test' }); } catch (_) {}
  }
}

// Expose to window for onclick handlers in HTML
// Функции для модального окна помощи
function showHelp() {
    document.getElementById('helpOverlay').style.display = 'flex';
}

function hideHelp() {
    document.getElementById('helpOverlay').style.display = 'none';
}

window.startTest = startTest;
window.showHelp = showHelp;
window.hideHelp = hideHelp;

function updatePersonalizationUI() {
  try {
    const name = (currentState.userName || '').trim();
    const el = document.getElementById('personalGreeting');
    if (!el) return;
    if (name) {
      el.style.display = 'block';
      el.textContent = `Хорошо, ${name}, давайте продолжим.`;
    } else {
      el.style.display = 'none';
      el.textContent = '';
    }
  } catch {}
}

window.toggleHint = toggleHint;
window.nextQuestion = nextQuestion;
window.prevQuestion = prevQuestion;
window.reviewBlock = reviewBlock;
// Функция для разворачивания компактных блоков результатов
function toggleBlockResult(blockId) {
    const details = document.getElementById(`details-${blockId}`);
    const toggle = document.getElementById(`toggle-${blockId}`);
    
    if (details && toggle) {
        details.classList.toggle('expanded');
        toggle.classList.toggle('expanded');
    }
}

// Инициализация обработчиков для компактных блоков
function initCompactBlocks() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.result-header')) {
            const header = e.target.closest('.result-header');
            const blockId = header.getAttribute('data-block');
            if (blockId) {
                toggleBlockResult(blockId);
            }
        }
    });
}

// Инициализация приложения
function initializeApp() {
    console.log('Инициализация приложения...');
    
    // Инициализация состояния
    currentState.currentQuestionIndex = 0;
    currentState.answers = {};
    currentState.blockResults = { 0: null, 1: null, 2: null, 3: null };
    
    // Скрыть все элементы, кроме заставки
    const intro = document.getElementById('intro');
    const questionCard = document.getElementById('questionCard');
    const finalResults = document.getElementById('finalResults');
    const progressContainer = document.querySelector('.progress-container');
    
    console.log('Элементы для скрытия:', { intro, questionCard, finalResults, progressContainer });
    
    if (intro) {
        intro.style.display = 'none';
        console.log('Intro скрыт');
    }
    if (questionCard) {
        questionCard.style.display = 'none';
        console.log('QuestionCard скрыт');
    }
    if (finalResults) {
        finalResults.style.display = 'none';
        console.log('FinalResults скрыт');
    }
    if (progressContainer) {
        progressContainer.style.display = 'none';
        console.log('ProgressContainer скрыт');
    }
    
    // Скрыть компактные блоки результатов
    document.querySelectorAll('.block-result-compact').forEach(el => el.style.display = 'none');
    
    // Показываем заставку
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        // Показываем заставку как flex, чтобы сработало центрирование по CSS
        loadingScreen.style.display = 'flex';
        console.log('Заставка показана');
    } else {
        console.error('Заставка не найдена!');
    }
    
    initCompactBlocks();
    console.log('Приложение инициализировано');

    // Запускаем анимацию загрузки с задержкой, если ещё не запущена
    setTimeout(() => {
        try {
            if (!loadingAnimationStarted) startLoadingAnimation();
        } catch (e) { console.warn('startLoadingAnimation error', e); try { showStartButton(); } catch(_) {} }
    }, 500);
}

// Анимированная заставка
let loadingState = {
    isLoading: true,
    currentStep: 0,
    progress: 0
};

// Массив сообщений для смены
const MESSAGES = [
    {
        text: '“Безопасность — это когда вы можете быть собой без страха осуждения"',
        attribution: '— Основа здоровых отношений'
    },
    {
        text: '“Отношения становятся надёжными, когда оба партнёра держат слово"',
        attribution: '— Основа доверия'
    },
    {
        text: '“Эмоциональная связь — это сердце любых зрелых отношений"',
        attribution: '— Глубина связи'
    },
    {
        text: '“Лучшие отношения те, в которых оба растут и становятся лучше"',
        attribution: '— Перспективы роста'
    }
];

let currentMessageIndex = 0;

function rotateMessage() {
    const messageText = document.getElementById('messageText');
    const messageAttribution = document.querySelector('.message-attribution');
    
    if (!messageText || !messageAttribution) return;
    
    setTimeout(() => {
        currentMessageIndex = (currentMessageIndex + 1) % MESSAGES.length;
        const message = MESSAGES[currentMessageIndex];
        
        messageText.textContent = message.text;
        messageAttribution.textContent = message.attribution;
    }, 4000); // Меняем каждые 4 секунды
}

function startLoadingAnimation() {
    if (loadingAnimationStarted) return;
    loadingAnimationStarted = true;
    console.log('Запуск анимации загрузки...');
    
    const loadingSteps = [
        'Подготовка вопросов...',
        'Настройка теста...',
        'Инициализация системы...',
        'Подготовка результатов...',
        'Готово к работе!'
    ];

    const loadingProgressBar = document.getElementById('loadingProgressBar');
    const loadingText = document.getElementById('loadingText');
    
    console.log('Элементы загрузки:', { loadingProgressBar, loadingText });
    
    // Проверяем, что элементы существуют
    if (!loadingProgressBar || !loadingText) {
        console.error('Элементы загрузки не найдены');
        // Если элементы не найдены, сразу показываем форму с именем
        setTimeout(() => {
            console.log('Показываем форму с именем (элементы загрузки не найдены)');
            showStartButton();
        }, 1000);
        return;
    }
    
  let currentStep = 0;
  let completed = false;

  function finishLoading() {
    if (completed) return;
    completed = true;
    console.log('Завершение анимации загрузки (finishLoading)');
    setTimeout(() => { try { showStartButton(); } catch (e) { console.error('showStartButton error', e); } }, 300);
  }

  function animateStep() {
    try {
      console.log(`Анимация шага ${currentStep + 1}/${loadingSteps.length}`);
      if (currentStep >= loadingSteps.length) {
        finishLoading();
        return;
      }
      const progress = ((currentStep + 1) / loadingSteps.length) * 100;
      if (loadingProgressBar) loadingProgressBar.style.width = `${progress}%`;
      if (loadingText) loadingText.textContent = loadingSteps[currentStep];
      currentStep++;
      setTimeout(animateStep, 1200);
    } catch (err) {
      console.warn('animateStep error, завершаем с запасом:', err);
      finishLoading();
    }
  }

  // Watchdog: если что-то пошло не так — завершаем через 6 секунд
  setTimeout(() => {
    if (!completed) {
      console.warn('Watchdog завершил заставку по таймауту');
      finishLoading();
    }
  }, 6000);

  // Начинаем анимацию через небольшую задержку
  console.log('Запуск анимации через 1 секунду...');
  setTimeout(() => { try { animateStep(); } catch (e) { finishLoading(); } }, 1000);
}

function showStartButton() {
    console.log('Показываем кнопку старта...');
    
    const loadingProgressBar = document.getElementById('loadingProgressBar');
    const loadingText = document.getElementById('loadingText');

    // Скрываем прогресс бар
    if (loadingProgressBar) {
        const progressContainer = loadingProgressBar.parentElement;
        if (progressContainer) {
            progressContainer.style.opacity = '0';
            progressContainer.style.transition = 'opacity 0.5s ease';
        }
    }
    
    // Скрываем текст загрузки
    if (loadingText) {
        loadingText.style.opacity = '0';
        loadingText.style.transition = 'opacity 0.5s ease';
    }

    // Показываем форму с именем пользователя
    setTimeout(() => {
        console.log('Переход к форме с именем...');
        
        // Скрываем заставку
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
            console.log('Заставка скрыта');
        }
        
        // Показываем форму с именем
        const intro = document.getElementById('intro');
        if (intro) {
            intro.style.display = 'block';
            console.log('Форма с именем показана');
            updatePersonalizationUI();
        } else {
            console.error('Форма с именем не найдена!');
        }
        
        // Инициализируем поле имени
        initUserNameInput();
        
        loadingState.isLoading = false;
        console.log('Загрузка завершена');
    }, 600);
}

// Обновленные экспорты функций (кнопка теперь вызывает startTest напрямую)
// window.handleCircleClick больше не нужен

// Убираем дублирующий обработчик - он уже есть выше

// Функции для модального окна
function showErrorModal(message) {
  const modal = document.getElementById('errorModal');
  const messageElement = document.getElementById('errorMessage');
  
  messageElement.textContent = message;
  modal.style.display = 'flex';
  
  // Плавное появление
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
}

function closeErrorModal() {
  const modal = document.getElementById('errorModal');
  
  modal.classList.remove('show');
  
  setTimeout(() => {
    modal.style.display = 'none';
  }, 300);
}

// Управление состоянием кнопок
function updateButtonStates() {
  const nextBtn = document.getElementById('nextBtn');
  const currentIndex = currentState.currentQuestionIndex;
  const currentAnswer = currentState.answers[currentIndex];
  
  // Отладочная информация
  console.log(`updateButtonStates: questionIndex=${currentIndex}, answer=${currentAnswer}, answers=`, currentState.answers);
  
  if (nextBtn) {
    const shouldDisable = (currentAnswer === undefined);
    nextBtn.disabled = shouldDisable;
    
    if (shouldDisable) {
      nextBtn.classList.add('disabled');
    } else {
      nextBtn.classList.remove('disabled');
    }
  }
}

// Обновляем состояние кнопок при выборе ответа
// Примечание: Логика выбора опции находится в showQuestion() функции
function selectOptionWithUpdate(questionIndex, value) {
  // Сохраняем ответ
  currentState.answers[questionIndex] = value;
  saveState();
  
  // Автоматически сохраняем результаты в Google Sheets
  autoSaveResults();
  
  // Обновляем состояние кнопок
  updateButtonStates();
}

// Автоматическое сохранение результатов
async function autoSaveResults() {
  try {
    // Рассчитываем результаты блоков, если возможно
    Object.keys(currentState.answers).forEach(questionIndex => {
      const blockIndex = Math.floor(questionIndex / 5);
      if (Object.keys(currentState.answers).filter(idx => Math.floor(idx / 5) === blockIndex).length === 5) {
        calculateBlockResult(blockIndex);
      }
    });
    
    // Собираем данные для отправки
    const payload = {
      token: SHARED_TOKEN || undefined,
      userName: currentState.userName || '',
      userId,
      invitedBy: getInvitedBy() || null,
      tag: 'auto-save',
      ref: 'auto-save',
      senderName: (currentState.userName || ''),
      recipientName: getInviterNameFromUrl() ? '' : '',
      utmSource: getUtmSource(),
      url: location.href,
      userAgent: navigator.userAgent,
      language: navigator.language,
      // YYYY-MM-DD HH:mm:ss в часовом поясе Москвы
      timestamp: (function(){
        const now = new Date();
        const moscowTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));
        const y = moscowTime.getFullYear();
        const m = String(moscowTime.getMonth()+1).padStart(2,'0');
        const d = String(moscowTime.getDate()).padStart(2,'0');
        const hh = String(moscowTime.getHours()).padStart(2,'0');
        const mm = String(moscowTime.getMinutes()).padStart(2,'0');
        const ss = String(moscowTime.getSeconds()).padStart(2,'0');
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
      })(),
      answersDetailed: buildDetailedAnswers(),
      blockResultsDetailed: buildBlockResultsDetailed(),
      overall: '', // Будет рассчитано позже
      priorityBlock: '', // Будет рассчитано позже
      status: 'auto' // Статус автосохранения
    };
    
    // Отправляем данные
    await fetch(GOOGLE_SHEETS_WEBAPP_URL, { 
      method: 'POST', 
      headers: { 'Content-Type': 'text/plain' }, 
      body: JSON.stringify(payload) 
    });
    
    console.log('Результаты автоматически сохранены');
  } catch (e) { 
    console.warn('Не удалось автоматически сохранить результаты:', e); 
  }
}

window.continueToBlock = continueToBlock;
window.continueToNextBlock = continueToNextBlock;
window.showFinalResults = showFinalResults;
window.downloadPDF = downloadPDF;
window.shareToTelegram = shareToTelegram;
window.shareToWhatsApp = shareToWhatsApp;
window.restartTest = restartTest;
window.showErrorModal = showErrorModal;
window.closeErrorModal = closeErrorModal;
window.updateButtonStates = updateButtonStates;
window.selectOptionWithUpdate = selectOptionWithUpdate;

window.toggleBlockResult = toggleBlockResult;
window.toggleHint = toggleHint;

// ===== New modal functions =====
window.openPlanModal = openPlanModal;
window.closePlanModal = closePlanModal;
window.openShareModal = openShareModal;
window.closeShareModal = closeShareModal;
window.openInviteModal = openInviteModal;
window.closeInviteModal = closeInviteModal;
window.copyInviteLink = copyInviteLink;

// ===== Plan generation functions =====

window.generatePlanPDF = generatePlanPDF;
window.renderPlanPreview = renderPlanPreview;
window.getPlanActions = getPlanActions;

// ===== Integrations from cursor branch =====
// Anonymous identity helpers
let userId = null;
function generateUUID() {
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);
  buf[6] = (buf[6] & 0x0f) | 0x40;
  buf[8] = (buf[8] & 0x3f) | 0x80;
  const hex = [...buf].map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.substring(0,8)}-${hex.substring(8,12)}-${hex.substring(12,16)}-${hex.substring(16,20)}-${hex.substring(20)}`;
}
function getOrCreateUserId() {
  try {
    const key = 'loveTestUserId';
    let id = localStorage.getItem(key);
    if (!id) { id = generateUUID(); localStorage.setItem(key, id); }
    return id;
  } catch { return generateUUID(); }
}
function getInvitedBy() { try { return new URLSearchParams(location.search).get('invited_by'); } catch { return null; } }
function getShareLinkForInvite() {
  try {
    const url = new URL(location.href);
    url.searchParams.set('invited_by', userId || '');
    const inviterName = (currentState.userName || '').trim();
    if (inviterName) url.searchParams.set('inviter_name', inviterName);
    return url.toString();
  } catch {
    return location.href;
  }
}

function getUtmSource() { try { return new URLSearchParams(location.search).get('utm_source') || ''; } catch { return ''; } }
function getInviterNameFromUrl() {
  try {
    const raw = new URLSearchParams(location.search).get('inviter_name');
    if (!raw) return '';
    try { return decodeURIComponent(raw); } catch { return raw; }
  } catch { return ''; }
}

function withUtm(urlString, source) {
  try { const url = new URL(urlString); if (source) url.searchParams.set('utm_source', source); return url.toString(); } catch { return urlString; }
}

let shareMode = 'result';
function buildShareText(opts) {
  const options = Object.assign({ source: '', includeLink: true }, opts || {});
  const src = options.source || '';
  const linkBase = shareMode === 'invite' ? getShareLinkForInvite() : TEST_URL;
  const link = src ? withUtm(linkBase, src) : linkBase;
  
  if (shareMode === 'invite') {
    // Персонализируем приглашение именем пользователя
    const userName = currentState.userName || '';
    let invitationText = '🧭 Тест «Зрелые отношения»';
    
    if (userName) {
      invitationText += `\nПривет! Меня зовут ${userName}.`;
      invitationText += '\nДавай пройдём этот тест вместе — это быстро и полезно.';
    } else {
      invitationText += '\nДавай пройдём его вместе — это быстро и полезно.';
    }
    
    const lines = [invitationText];
    if (options.includeLink) lines.push('', link);
    return lines.join('\n');
  }
  
  // Проверяем, есть ли уже результаты теста
  const overallElement = document.getElementById('overallStatus');
  const priorityElement = document.getElementById('priorityBlock');
  
  if (overallElement && priorityElement) {
    // Если результаты уже есть, используем их
    const overall = overallElement.textContent || '';
    const priority = priorityElement.textContent || '';
    const userName = currentState.userName || '';
    
    let resultText = '📊 Результаты теста «Зрелые отношения»';
    if (userName) {
      resultText += `\nТест прошёл: ${userName}`;
    }
    resultText += `\n• Общее состояние: ${overall}`;
    resultText += `\n• Приоритетный блок: ${priority}`;
    
    const lines = [resultText];
    if (options.includeLink) lines.push('', link);
    return lines.join('\n');
  } else {
    // Если результатов нет, возвращаем базовый текст
    const userName = currentState.userName || '';
    let baseText = '🧭 Тест «Зрелые отношения»';
    if (userName) {
      baseText += `\nРекомендую ${userName}`;
    }
    baseText += '\nПройти тест можно по ссылке ниже';
    
    const lines = [baseText];
    if (options.includeLink) lines.push('', link);
    return lines.join('\n');
  }
}

function shareToTelegram() { const src='telegram'; const linkBase = shareMode==='invite'?getShareLinkForInvite():TEST_URL; const link=withUtm(linkBase, src); const text=buildShareText({ source: src, includeLink: false }); const url=`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`; safeOpen(url); }
window.shareToTelegram = function() { try { shareToTelegram(); fetch(GOOGLE_SHEETS_WEBAPP_URL,{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({token:SHARED_TOKEN,userId,ref:'final-results',event:'share',eventPayload:{channel:'telegram'}})});} catch(_){} };
function shareToWhatsApp() { const src='whatsapp'; const text=buildShareText({ source: src, includeLink: true }); const url=`https://wa.me/?text=${encodeURIComponent(text)}`; safeOpen(url); }
window.shareToWhatsApp = function() { try { shareToWhatsApp(); fetch(GOOGLE_SHEETS_WEBAPP_URL,{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({token:SHARED_TOKEN,userId,ref:'final-results',event:'share',eventPayload:{channel:'whatsapp'}})});} catch(_){} };
function shareToEmail() { 
  const src='email'; 
  const subject = shareMode === 'invite' 
    ? 'Приглашение пройти тест «Зрелые отношения»' 
    : 'Мои результаты теста «Зрелые отношения»'; 
  const body=buildShareText({ source: src, includeLink: true }); 
  location.href=`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`; 
}
window.shareToEmail = function() { try { shareToEmail(); fetch(GOOGLE_SHEETS_WEBAPP_URL,{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({token:SHARED_TOKEN,userId,ref:'final-results',event:'share',eventPayload:{channel:'email'}})});} catch(_){} };
async function copyShareText() { const src='copy'; const text=buildShareText({ source: src, includeLink: true }); try { await navigator.clipboard.writeText(text); alert('Текст результата скопирован'); } catch { const ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); alert('Текст результата скопирован'); } }

async function saveResults(tag) {
  try {
    calculateOverallResult();
    const overall = document.getElementById('overallStatus')?.textContent || '';
    const priority = document.getElementById('priorityBlock')?.textContent || '';
    const payload = {
      token: SHARED_TOKEN || undefined,
      userId,
      invitedBy: getInvitedBy() || null,
      tag: tag || null,
      ref: tag || null,
      senderName: (currentState.userName || ''),
      recipientName: getInviterNameFromUrl() ? '' : '',
      utmSource: getUtmSource(),
      url: location.href,
      userAgent: navigator.userAgent,
      language: navigator.language,
      // YYYY-MM-DD HH:mm:ss в часовом поясе Москвы
      timestamp: (function(){
        const now = new Date();
        const moscowTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));
        const y = moscowTime.getFullYear();
        const m = String(moscowTime.getMonth()+1).padStart(2,'0');
        const d = String(moscowTime.getDate()).padStart(2,'0');
        const hh = String(moscowTime.getHours()).padStart(2,'0');
        const mm = String(moscowTime.getMinutes()).padStart(2,'0');
        const ss = String(moscowTime.getSeconds()).padStart(2,'0');
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
      })(),
      answersDetailed: buildDetailedAnswers(),
      blockResultsDetailed: buildBlockResultsDetailed(),
      overall,
      priorityBlock: priority,
      status: tag === 'final' ? 'completed' : 'manual' // 'completed' for final save, 'manual' for other explicit saves
    };
    safePostToServer(payload);
  } catch (e) { console.warn('Не удалось сохранить результаты:', e); }
}

function buildDetailedAnswers() { const details=[]; Object.entries(currentState.answers).forEach(([idxStr,value])=>{ const idx=Number(idxStr); const q=QUESTIONS[idx]; if(!q) return; const opt=(q.options||[]).find(o=>o.value===value); details.push({ номерВопроса:(idx%5)+1, порядковыйИндекс:idx, id:q.id, блок:q.block, вопрос:q.text, выбранныйВариант: opt?opt.label:'', балл:value }); }); return details; }
function buildBlockResultsDetailed() { const names=['Безопасность','Надёжность','Связь','Рост']; return Object.entries(currentState.blockResults).map(([i,block])=>{ if(!block) return null; const zoneText={ success:'Зона силы', warning:'Зона риска', danger:'Зона тревоги' }[block.zone]; return { блок:names[Number(i)], баллы:`${block.sum}/15`, зона:zoneText }; }).filter(Boolean); }

// ===== Modal functions =====
function openPlanModal() {
  document.getElementById('planModal').classList.add('show');
  renderPlanPreview();
}

function closePlanModal() {
  document.getElementById('planModal').classList.remove('show');
}

function openShareModal() {
  document.getElementById('shareModal').classList.add('show');
  shareMode = 'result';
}

function closeShareModal() {
  document.getElementById('shareModal').classList.remove('show');
}

function openInviteModal() {
  document.getElementById('inviteModal').classList.add('show');
  shareMode = 'invite';
  const inviteLink = getShareLinkForInvite();
  document.getElementById('inviteLink').value = inviteLink;
}

function closeInviteModal() {
  document.getElementById('inviteModal').classList.remove('show');
}

async function copyInviteLink() {
  const inviteLink = document.getElementById('inviteLink');
  const inviteText = buildShareText({ source: 'copy', includeLink: true });
  
  try {
    await navigator.clipboard.writeText(inviteText);
    alert('Приглашение скопировано!');
  } catch {
    // Fallback для старых браузеров
    const textArea = document.createElement('textarea');
    textArea.value = inviteText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
    alert('Приглашение скопировано!');
  }
}

// ===== Plan generation functions =====
function renderPlanPreview() {
  const planPreview = document.getElementById('planPreview');
  if (!planPreview) return;
  
  calculateOverallResult();
  const priority = document.getElementById('priorityBlock')?.textContent || 'Партнёрство';
  
  const plan = getPlanActions(priority);
  // Подменяем план из таблицы, если есть
  try {
    const raw = localStorage.getItem('testPlan');
    if (raw) {
      const map = JSON.parse(raw);
      const bi = ['Безопасность','Надёжность','Связь','Рост'].indexOf(priority);
      if (map && map[String(bi)] && Array.isArray(map[String(bi)]) && map[String(bi)].length) {
        // Преобразуем в формат getPlanActions
        const converted = map[String(bi)].map(x => ({ timeframe: x.timeframe, title: x.title, description: x.description }));
        if (converted.length) plan.splice(0, plan.length, ...converted);
      }
    }
  } catch (_) {}
  planPreview.innerHTML = `
    <div class="plan-header">
      <h4>📋 Персональный план действий</h4>
      <p>Основан на результатах вашего теста</p>
    </div>
    <div class="plan-timeline">
      ${plan.map((action, idx) => `
        <div class="plan-action" data-idx="${idx}">
          <div class="action-timeframe">${action.timeframe}</div>
          <div class="action-content">
            <h5>${action.title}</h5>
            <p>${action.description}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  // Логирование кликов по элементам плана
  try {
    document.querySelectorAll('.plan-action').forEach((el) => {
      el.addEventListener('click', () => {
        const idx = Number(el.getAttribute('data-idx') || '0');
        const action = plan[idx];
        try { safePostToServer({ token: SHARED_TOKEN, userId, ref: 'final-results', event: 'click_plan_action', eventPayload: { index: idx, title: action?.title || '', timeframe: action?.timeframe || '' } }); } catch (_) {}
      });
    });
  } catch (_) {}
}

function getPlanActions(priorityBlock) {
  const baseActions = [
    {
      timeframe: 'На этой неделе',
      title: 'Начните с малого',
      description: 'Выберите одну конкретную область для улучшения и сфокусируйтесь на ней.'
    },
    {
      timeframe: 'В течение месяца',
      title: 'Создайте привычку',
      description: 'Внедрите регулярную практику для укрепления выбранной сферы.'
    },
    {
      timeframe: 'Через 3 месяца',
      title: 'Оцените прогресс',
      description: 'Пройдите тест снова и сравните результаты.'
    }
  ];
  
  const specificActions = {
    'Безопасность': [
      {
        timeframe: 'На этой неделе',
        title: 'Установите границы',
        description: 'Обсудите и запишите 3 важные границы для ваших отношений.'
      }
    ],
    'Надёжность': [
      {
        timeframe: 'На этой неделе',
        title: 'Дайте обещание',
        description: 'Возьмите на себя одно конкретное обязательство и выполните его.'
      }
    ],
    'Партнёрство': [
      {
        timeframe: 'На этой неделе',
        title: 'Совместное планирование',
        description: 'Запланируйте вместе одно важное событие на следующую неделю.'
      }
    ],
    'Эмоциональная связь': [
      {
        timeframe: 'На этой неделе',
        title: 'Глубокий разговор',
        description: 'Выделите 30 минут для разговора о чувствах без отвлечений.'
      }
    ]
  };
  
  const specific = specificActions[priorityBlock] || specificActions['Партнёрство'];
  return [...specific, ...baseActions.slice(1)];
}



function generatePlanPDF() { /* отключено */ }

function generateICSContent(plan) {
  const now = new Date();
  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Love Test//Plan Generator//RU',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];
  
  plan.forEach((action, index) => {
    const startDate = new Date(now.getTime() + (index + 1) * 7 * 24 * 60 * 60 * 1000);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    
    ics.push(
      'BEGIN:VEVENT',
      `UID:${generateUUID()}`,
      `DTSTAMP:${now.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTEND:${endDate.getTime() + 60 * 60 * 1000}Z`,
      `SUMMARY:${action.title}`,
      `DESCRIPTION:${action.description}`,
      'END:VEVENT'
    );
  });
  
  ics.push('END:VCALENDAR');
  return ics.join('\r\n');
}

function generatePDFContent(plan) {
  try {
    // Проверяем, что jsPDF доступен
    if (typeof window.jsPDF === 'undefined') {
      throw new Error('jsPDF не загружен');
    }
    
    const { jsPDF } = window.jsPDF;
    const doc = new jsPDF();
    
    // Настройка шрифтов для русского языка
    doc.setFont('helvetica');
    
    // Заголовок
    doc.setFontSize(24);
    doc.setTextColor(107, 92, 165); // Основной цвет
    doc.text('📋 Персональный план действий', 105, 30, { align: 'center' });
    
    // Подзаголовок
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text('Основан на результатах теста «Зрелые отношения»', 105, 45, { align: 'center' });
    
    // Дата
    doc.setFontSize(12);
    doc.text(`Дата: ${new Date().toLocaleDateString('ru-RU')}`, 105, 55, { align: 'center' });
    
    // План действий
    let yPosition = 80;
    plan.forEach((action, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
      
      // Временные рамки
      doc.setFontSize(12);
      doc.setTextColor(107, 92, 165);
      doc.setFont('helvetica', 'bold');
      doc.text(action.timeframe, 20, yPosition);
      
      // Заголовок действия
      doc.setFontSize(14);
      doc.setTextColor(50, 50, 50);
      doc.setFont('helvetica', 'bold');
      doc.text(action.title, 20, yPosition + 15);
      
      // Описание
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      
      // Разбиваем описание на строки, если оно длинное
      const descriptionLines = doc.splitTextToSize(action.description, 170);
      doc.text(descriptionLines, 20, yPosition + 25);
      
      // Разделитель
      if (index < plan.length - 1) {
        doc.setDrawColor(200, 200, 200);
        doc.line(20, yPosition + 35 + (descriptionLines.length * 5), 190, yPosition + 35 + (descriptionLines.length * 5));
      }
      
      yPosition += 45 + (descriptionLines.length * 5);
    });
    
    return doc;
  } catch (error) {
    console.error('Ошибка генерации PDF:', error);
    // Fallback - возвращаем HTML для скачивания
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>План действий</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .action { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
          .timeframe { font-weight: bold; color: #6b5ca5; }
          .title { font-size: 18px; margin: 10px 0; }
          .description { color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📋 Персональный план действий</h1>
          <p>Основан на результатах теста «Зрелые отношения»</p>
          <p>Дата: ${new Date().toLocaleDateString('ru-RU')}</p>
        </div>
        ${plan.map(action => `
          <div class="action">
            <div class="timeframe">${action.timeframe}</div>
            <div class="title">${action.title}</div>
            <div class="description">${action.description}</div>
          </div>
        `).join('')}
      </body>
      </html>
    `;
    return htmlContent;
  }
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function addToCalendar() {
  const plan = getPlanActions(document.getElementById('priorityBlock')?.textContent || 'Партнёрство');
  
  if (!plan || plan.length === 0) {
    showErrorModal('Не удалось загрузить план действий');
    return;
  }

  const firstAction = plan[0];
  const now = new Date();
  
  // Создаем событие на следующую неделю
  const startDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Через неделю
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Через час
  
  // Форматируем даты для Google Calendar URL (формат YYYYMMDDTHHMMSSZ)
  const formatDateForGoogle = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  };
  
  // Создаем URL для Google Calendar
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(firstAction.title)}&dates=${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}&details=${encodeURIComponent(firstAction.description)}&location=Онлайн&sf=true&output=xml`;
  
  // Создаем URL для Outlook Calendar
  const outlookCalendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(firstAction.title)}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&body=${encodeURIComponent(firstAction.description)}&location=Онлайн`;
  
  // Создаем URL для Yahoo Calendar
  const yahooCalendarUrl = `https://calendar.yahoo.com/?v=60&title=${encodeURIComponent(firstAction.title)}&st=${startDate.toISOString()}&et=${endDate.toISOString()}&desc=${encodeURIComponent(firstAction.description)}&in_loc=Онлайн`;
  
  // Определяем платформу пользователя
  const userAgent = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isAndroid = /android/.test(userAgent);
  const isMobile = isIOS || isAndroid;
  
  // Создаем модальное окно с выбором календаря
  const modalHtml = `
    <div class="modal-overlay show" id="calendarModal">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-icon">📅</div>
          <h3>Добавить в календарь</h3>
          <button class="modal-close" onclick="closeCalendarModal()">×</button>
        </div>
        <div class="modal-body">
          <div class="calendar-options">
            <div class="calendar-option">
              <h4>🌐 Google Календарь (рекомендуется)</h4>
              <p>Откроется в браузере, работает на всех устройствах</p>
              <button class="btn btn-primary" onclick="openGoogleCalendar()">
                <span class="btn-icon">📅</span>
                Открыть Google Calendar
              </button>
            </div>
            
            <div class="calendar-option">
              <h4>📧 Outlook Календарь</h4>
              <p>Для пользователей Microsoft 365 и Outlook</p>
              <button class="btn btn-secondary" onclick="openOutlookCalendar()">
                <span class="btn-icon">📧</span>
                Открыть Outlook Calendar
              </button>
            </div>
            
            <div class="calendar-option">
              <h4>🔍 Yahoo Календарь</h4>
              <p>Альтернативный веб-календарь</p>
              <button class="btn btn-secondary" onclick="openYahooCalendar()">
                <span class="btn-icon">🔍</span>
                Открыть Yahoo Calendar
              </button>
            </div>
            
            ${isIOS ? `
            <div class="calendar-option">
              <h4>🍎 Apple Календарь</h4>
              <p>Для устройств Apple (может потребовать дополнительных действий)</p>
              <button class="btn btn-secondary" onclick="downloadICSFile()">
                <span class="btn-icon">📥</span>
                Скачать .ics файл
              </button>
            </div>
            ` : ''}
            
            ${isAndroid ? `
            <div class="calendar-option">
              <h4>🤖 Android Календарь</h4>
              <p>Google Calendar откроется автоматически</p>
              <button class="btn btn-secondary" onclick="openGoogleCalendar()">
                <span class="btn-icon">📅</span>
                Открыть Google Calendar
              </button>
            </div>
            ` : ''}
            
            <div class="calendar-option">
              <h4>💾 Альтернативный вариант</h4>
              <p>Скачать файл .ics для импорта в любой календарь</p>
              <button class="btn btn-outline" onclick="downloadICSFile()">
                <span class="btn-icon">📥</span>
                Скачать .ics файл
              </button>
            </div>
          </div>
          
          <div class="calendar-help">
            <h4>💡 Как это работает?</h4>
            <ul>
              <li><strong>Google Calendar:</strong> Событие откроется в браузере, нажмите "Сохранить"</li>
              <li><strong>.ics файл:</strong> Скачайте и дважды кликните для добавления в календарь</li>
              <li><strong>Мобильные устройства:</strong> Google Calendar автоматически откроется в приложении</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Добавляем модальное окно на страницу
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  
  // Сохраняем URL для использования в функциях
  window.googleCalendarUrl = googleCalendarUrl;
  window.outlookCalendarUrl = outlookCalendarUrl;
  window.yahooCalendarUrl = yahooCalendarUrl;
}

// Функция для открытия Google Calendar
function openGoogleCalendar() {
  if (window.googleCalendarUrl) {
    safeOpen(window.googleCalendarUrl);
    closeCalendarModal();
    try {
      fetch(GOOGLE_SHEETS_WEBAPP_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: SHARED_TOKEN, userId, ref: 'final-results', event: 'add_to_calendar', eventPayload: { provider: 'google' } }) });
    } catch (_) {}
  }
}

// Функция для открытия Outlook Calendar
function openOutlookCalendar() {
  if (window.outlookCalendarUrl) {
    safeOpen(window.outlookCalendarUrl);
    closeCalendarModal();
  }
}

// Функция для открытия Yahoo Calendar
function openYahooCalendar() {
  if (window.yahooCalendarUrl) {
    safeOpen(window.yahooCalendarUrl);
    closeCalendarModal();
  }
}

// Функция для скачивания .ics файла (fallback)
function downloadICSFile() {
  const plan = getPlanActions(document.getElementById('priorityBlock')?.textContent || 'Партнёрство');
  const icsContent = generateICSContent(plan);
  
  // Создаем и скачиваем файл
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'plan.ics';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
  closeCalendarModal();
  
  // Показываем уведомление
  alert('Файл .ics скачан! Откройте его, чтобы добавить событие в ваш календарь.');
  try {
    fetch(GOOGLE_SHEETS_WEBAPP_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: SHARED_TOKEN, userId, ref: 'final-results', event: 'download_ics' }) });
  } catch (_) {}
}

// Функция для закрытия модального окна календаря
function closeCalendarModal() {
  const modal = document.getElementById('calendarModal');
  if (modal) {
    modal.remove();
  }
  // Очищаем глобальные переменные
  delete window.googleCalendarUrl;
  delete window.outlookCalendarUrl;
  delete window.yahooCalendarUrl;
}

// Обновляем экспорт функций
window.addToCalendar = addToCalendar;
window.openGoogleCalendar = openGoogleCalendar;
window.openOutlookCalendar = openOutlookCalendar;
window.openYahooCalendar = openYahooCalendar;
window.downloadICSFile = downloadICSFile;
window.closeCalendarModal = closeCalendarModal;
