// Configuration
const TEST_URL = window.location.href;
// Google Sheets Web App endpoint (provided by user)
const GOOGLE_SHEETS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbztWCE72POOwC8pPx595xgS8aPVwvaU3btijvNFvwHE9mcccYMo3P6NfTXc-qaAcptWGA/exec';
const SHARED_TOKEN = 'rk7GJ6QdZC3M5p9X2a8Vn0L4s1HfEwBt';

const QUESTIONS = [
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

// App state
let currentState = {
  currentQuestionIndex: 0,
  answers: {},
  blockResults: { 0: null, 1: null, 2: null, 3: null }
};

// Anonymous identity
let userId = null;
function generateUUID() {
  // RFC4122 v4 using crypto
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);
  buf[6] = (buf[6] & 0x0f) | 0x40;
  buf[8] = (buf[8] & 0x3f) | 0x80;
  const hex = [...buf].map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.substr(0,8)}-${hex.substr(8,4)}-${hex.substr(12,4)}-${hex.substr(16,4)}-${hex.substr(20)}`;
}
function getOrCreateUserId() {
  try {
    const key = 'loveTestUserId';
    let id = localStorage.getItem(key);
    if (!id) {
      id = generateUUID();
      localStorage.setItem(key, id);
    }
    return id;
  } catch { return generateUUID(); }
}
function getInvitedBy() {
  const p = new URLSearchParams(location.search);
  return p.get('invited_by');
}
function getShareLinkForInvite() {
  const url = new URL(location.href);
  url.searchParams.set('invited_by', userId || '');
  return url.toString();
}

// Init
window.addEventListener('DOMContentLoaded', () => {
  // Accessibility roles
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-valuemin', '0');
    progressBar.setAttribute('aria-valuemax', '100');
  }

  // Anonymous id
  userId = getOrCreateUserId();

  // Dynamic years in footers
  const year = new Date().getFullYear();
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) yearSpan.textContent = String(year);
  const pdfYear = document.getElementById('pdfYear');
  if (pdfYear) pdfYear.textContent = String(year);

  loadState();
  updateProgress();

  if (currentState.currentQuestionIndex > 0) {
    showQuestion(currentState.currentQuestionIndex);
  }
});

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
  document.getElementById('intro').style.display = 'none';
  showQuestion(0);
}

function showQuestion(index) {
  const question = QUESTIONS[index];
  const card = document.getElementById('questionCard');
  const optionsContainer = document.getElementById('optionsContainer');

  card.style.display = 'block';
  document.getElementById('blockTag').textContent = question.block;
  document.getElementById('questionNumber').textContent = `Вопрос ${index % 5 + 1} из 5`;
  document.getElementById('questionText').textContent = question.text;

  // Inject hint content
  const hintContent = document.getElementById('hintContent');
  const hintDetails = document.getElementById('hintDetails');
  if (hintContent) hintContent.textContent = question.hint || '';
  if (hintDetails) hintDetails.open = false;

  optionsContainer.innerHTML = '';
  optionsContainer.setAttribute('role', 'radiogroup');

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

      currentState.answers[index] = option.value;
      saveState();
    };

    optionElement.addEventListener('click', selectThis);
    optionElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectThis(); }
    });

    optionsContainer.appendChild(optionElement);
  });

  document.getElementById('prevBtn').style.display = index > 0 ? 'flex' : 'none';

  currentState.currentQuestionIndex = index;
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleHint() {
  const hintContent = document.getElementById('hintContent');
  const isVisible = hintContent.style.display === 'block';
  hintContent.style.display = isVisible ? 'none' : 'block';
}

function updateProgress() {
  const progress = (currentState.currentQuestionIndex / 20) * 100;
  const bar = document.getElementById('progressBar');
  bar.style.width = `${progress}%`;
  bar.setAttribute('aria-valuenow', String(Math.round(progress)));
}

function nextQuestion() {
  const answer = currentState.answers[currentState.currentQuestionIndex];
  if (answer === undefined) {
    alert('Пожалуйста, выберите ответ на вопрос.');
    return;
  }

  if (currentState.currentQuestionIndex < 19) {
    showQuestion(currentState.currentQuestionIndex + 1);
  } else {
    calculateBlockResult(3);
    showBlockResult(4);
  }

  if ((currentState.currentQuestionIndex + 1) % 5 === 0 && currentState.currentQuestionIndex < 19) {
    const blockIndex = Math.floor((currentState.currentQuestionIndex + 1) / 5) - 1;
    calculateBlockResult(blockIndex);
    showBlockResult(blockIndex + 1);
  }
}

function prevQuestion() {
  if (currentState.currentQuestionIndex > 0) {
    if (currentState.currentQuestionIndex % 5 === 0) {
      showBlockResult(Math.floor(currentState.currentQuestionIndex / 5));
    } else {
      showQuestion(currentState.currentQuestionIndex - 1);
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

  const scoreElement = document.getElementById(`block${blockIndex + 1}Score`);
  const percentage = (sum / 15) * 100;
  const color = { success: 'var(--success)', warning: 'var(--warning)', danger: 'var(--danger)' }[
    currentState.blockResults[blockIndex].zone
  ];

  scoreElement.style.background = `conic-gradient(${color} ${percentage}%, #e0e4e8 ${percentage}%)`;
  scoreElement.querySelector('.score-text').textContent = `${sum}/15`;

  const zoneLabel = scoreElement.nextElementSibling;
  zoneLabel.className = `zone-label zone-${currentState.blockResults[blockIndex].zone}`;
  zoneLabel.textContent = { success: 'Зона силы', warning: 'Зона риска', danger: 'Зона тревоги' }[
    currentState.blockResults[blockIndex].zone
  ];
}

function continueToBlock(blockNumber) {
  const questionIndex = (blockNumber - 1) * 5;
  showQuestion(questionIndex);
}

function reviewBlock(blockNumber) { continueToBlock(blockNumber); }

function showFinalResults() {
  document.getElementById('blockResult4').style.display = 'none';
  document.getElementById('finalResults').style.display = 'block';
  calculateOverallResult();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function calculateOverallResult() {
  const total = Object.values(currentState.blockResults).reduce((sum, block) => sum + (block ? block.sum : 0), 0);
  const avg = total / 4;

  let overall = 'зрелые';
  if (avg < 8) overall = 'разрушительные';
  else if (avg < 11) overall = 'шаткие';
  document.getElementById('overallStatus').textContent = overall;

  const lowestBlock = Object.entries(currentState.blockResults).reduce(
    (lowest, [index, block]) => {
      if (!block) return lowest;
      return block.sum < lowest.sum ? { index, sum: block.sum } : lowest;
    },
    { index: null, sum: Infinity }
  );

  const blockNames = ['Безопасность', 'Надёжность', 'Связь', 'Рост'];
  document.getElementById('priorityBlock').textContent = blockNames[lowestBlock.index];

  // PDF view data population (for screen)
  document.getElementById('pdfDate').textContent = `Дата: ${new Date().toLocaleDateString('ru-RU')}`;
  const pdfTableBody = document.getElementById('pdfTableBody');
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

  document.getElementById('pdfSummary').innerHTML = `
    <p><strong>Общее состояние:</strong> ${overall}</p>
    <p><strong>Приоритетный блок:</strong> ${blockNames[lowestBlock.index]}</p>
  `;

  document.getElementById('pdfRecommendations').innerHTML = `
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

// Load and embed Cyrillic font for jsPDF
let __pdfFontReady = false;
async function embedCyrillicFont(doc) {
  if (__pdfFontReady) return true;
  try {
    const fontUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto-Regular.ttf';
    const res = await fetch(fontUrl, { mode: 'cors' });
    if (!res.ok) throw new Error('font fetch failed');
    const buf = await res.arrayBuffer();
    const base64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(',')[1]);
      reader.readAsDataURL(new Blob([buf]));
    });
    doc.addFileToVFS('Roboto-Regular.ttf', base64);
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    __pdfFontReady = true;
    return true;
  } catch (e) {
    console.warn('Не удалось загрузить шрифт для PDF, используем стандартный:', e);
    return false;
  }
}

// New PDF generator with jsPDF + AutoTable
async function downloadPDF() {
  try {
    calculateOverallResult();
    const overall = document.getElementById('overallStatus')?.textContent || '';
    const priority = document.getElementById('priorityBlock')?.textContent || '';

    const names = ['Безопасность', 'Надёжность', 'Связь', 'Рост'];
    const rows = names.map((name, i) => {
      const block = currentState.blockResults[i];
      if (!block) return [name, '-', '-'];
      const zoneText = { success: 'Зона силы', warning: 'Зона риска', danger: 'Зона тревоги' }[block.zone];
      return [name, `${block.sum}/15`, zoneText];
    });

    const dd = {
      content: [
        { text: 'Результаты теста: Зрелые отношения', style: 'header', alignment: 'center' },
        { text: `Дата: ${new Date().toLocaleDateString('ru-RU')}`, margin: [0, 4, 0, 12], alignment: 'center' },
        { columns: [
          { text: `Общее состояние: ${overall}`, width: '50%' },
          { text: `Приоритетный блок: ${priority}`, width: '50%' }
        ], margin: [0, 0, 0, 12] },
        { text: 'Итоги по блокам', style: 'subheader' },
        {
          table: {
            headerRows: 1,
            widths: ['*', 60, 100],
            body: [
              ['Блок', 'Баллы', 'Зона'],
              ...rows
            ]
          },
          layout: 'lightHorizontalLines',
          margin: [0, 6, 0, 12]
        },
        { text: 'Рекомендации', style: 'subheader' },
        { ul: [
          'Работа с границами — установите одну четкую границу и обсудите её.',
          'Укрепление связи — ежедневный «ритуал конца дня» 10 минут без телефонов.',
          'Личностный рост — обсудите, что хотите развивать.'
        ]}
      ],
      styles: {
        header: { fontSize: 16, bold: true },
        subheader: { fontSize: 13, bold: true }
      },
      defaultStyle: { font: 'Roboto' }
    };

    if (window.pdfMake && window.pdfMake.createPdf) {
      pdfMake.createPdf(dd).download('результаты_теста_отношения.pdf');
    } else {
      alert('PDF движок не загрузился. Обновите страницу и попробуйте ещё раз.');
    }
  } catch (e) {
    console.error('PDF ошибка:', e);
    alert('Не удалось сформировать PDF. Попробуйте ещё раз.');
  }
}

// Share modal state
let shareMode = 'result'; // 'result' | 'invite'

function openShareModal() {
  shareMode = 'result';
  const m = document.getElementById('shareModal');
  const title = document.getElementById('shareModalTitle');
  if (title) title.textContent = 'Поделиться результатом';
  if (m) m.style.display = 'flex';
}
function openInviteModal() {
  shareMode = 'invite';
  const m = document.getElementById('shareModal');
  const title = document.getElementById('shareModalTitle');
  if (title) title.textContent = 'Пригласить пройти тест';
  if (m) m.style.display = 'flex';
}
function closeShareModal() { const m = document.getElementById('shareModal'); if (m) { m.style.display = 'none'; } }

function buildShareText(opts) {
  const options = Object.assign({ source: '', includeLink: true }, opts || {});
  const src = options.source || '';
  const linkBase = shareMode === 'invite' ? getShareLinkForInvite() : TEST_URL;
  const link = src ? withUtm(linkBase, src) : linkBase;

  if (shareMode === 'invite') {
    const lines = [
      '🧭 Тест «Зрелые отношения»',
      'Давай пройдём его вместе — это быстро и полезно.'
    ];
    if (options.includeLink) {
      lines.push('', link);
    }
    return lines.join('\n');
  }

  // result mode
  calculateOverallResult();
  const overall = document.getElementById('overallStatus')?.textContent || '';
  const priority = document.getElementById('priorityBlock')?.textContent || '';
  const lines = [
    '📊 Результаты теста «Зрелые отношения»',
    `• Общее состояние: ${overall}`,
    `• Приоритетный блок: ${priority}`
  ];
  if (options.includeLink) {
    lines.push('', link);
  }
  return lines.join('\n');
}

function safeOpen(url) { const newWin = window.open(url, '_blank'); if (newWin) newWin.opener = null; }

// UTM helpers for share links
function withUtm(urlString, source) {
  try {
    const url = new URL(urlString);
    if (source) url.searchParams.set('utm_source', source);
    return url.toString();
  } catch { return urlString; }
}

function getShareLinkForInviteWithSource(source) {
  const base = getShareLinkForInvite();
  return withUtm(base, source);
}

function shareToTelegram() {
  const src = 'telegram';
  // В Telegram для предпросмотра передаём ссылку только в параметре url,
  // а в тексте ссылку не добавляем (чтобы не было дублей).
  const linkBase = shareMode === 'invite' ? getShareLinkForInvite() : TEST_URL;
  const link = withUtm(linkBase, src);
  const text = buildShareText({ source: src, includeLink: false });
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`;
  safeOpen(shareUrl);
}

function shareToWhatsApp() {
  const src = 'whatsapp';
  const text = buildShareText({ source: src, includeLink: true });
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  safeOpen(whatsappUrl);
}

function shareToEmail() {
  const src = 'email';
  const subject = 'Мои результаты теста «Зрелые отношения»';
  const body = buildShareText({ source: src, includeLink: true });
  const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = url;
}

async function copyShareText() {
  const src = 'copy';
  const text = buildShareText({ source: src, includeLink: true });
  try {
    await navigator.clipboard.writeText(text);
    alert('Текст результата скопирован в буфер обмена');
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    alert('Текст результата скопирован в буфер обмена');
  }
}

function buildDetailedAnswers() {
  const details = [];
  Object.entries(currentState.answers).forEach(([idxStr, value]) => {
    const idx = Number(idxStr);
    const q = QUESTIONS[idx];
    if (!q) return;
    const opt = (q.options || []).find(o => o.value === value);
    details.push({
      номерВопроса: (idx % 5) + 1,
      порядковыйИндекс: idx,
      id: q.id,
      блок: q.block,
      вопрос: q.text,
      выбранныйВариант: opt ? opt.label : '',
      балл: value
    });
  });
  return details;
}

function buildBlockResultsDetailed() {
  const names = ['Безопасность', 'Надёжность', 'Связь', 'Рост'];
  return Object.entries(currentState.blockResults).map(([i, block]) => {
    if (!block) return null;
    const zoneText = { success: 'Зона силы', warning: 'Зона риска', danger: 'Зона тревоги' }[block.zone];
    return { блок: names[Number(i)], баллы: `${block.sum}/15`, зона: zoneText };
  }).filter(Boolean);
}

async function saveResults(tag) {
  try {
    // Ensure overall/priority are computed
    calculateOverallResult();
    const overall = document.getElementById('overallStatus')?.textContent || '';
    const priority = document.getElementById('priorityBlock')?.textContent || '';

    const payload = {
      token: SHARED_TOKEN || undefined,
      userId,
      invitedBy: getInvitedBy() || null,
      tag: tag || null,
      url: location.href,
      userAgent: navigator.userAgent,
      language: navigator.language,
      timestamp: new Date().toISOString(),
      // подробные ответы и итоги
      answersDetailed: buildDetailedAnswers(),
      blockResultsDetailed: buildBlockResultsDetailed(),
      overall,
      priorityBlock: priority
    };
    await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.warn('Не удалось сохранить результаты:', e);
  }
}

// Example: call saveResults when показываем финальные результаты
const _origShowFinal = showFinalResults;
showFinalResults = function() {
  _origShowFinal();
  // Try to derive tag from URL (utm_source or ref)
  const params = new URLSearchParams(location.search);
  const tag = params.get('utm_source') || params.get('ref') || null;
  saveResults(tag);
};

// Strong restart: fully reset UI and state
function restartTest() {
  if (confirm('Вы уверены, что хотите начать тест заново? Все ваши ответы будут потеряны.')) {
    clearState();
    // Hide question card and all block results
    const card = document.getElementById('questionCard');
    if (card) card.style.display = 'none';
    for (let i = 1; i <= 4; i++) {
      const el = document.getElementById(`blockResult${i}`);
      if (el) el.style.display = 'none';
    }
    const final = document.getElementById('finalResults');
    if (final) final.style.display = 'none';
    const intro = document.getElementById('intro');
    if (intro) intro.style.display = 'block';
    // Reset progress bar and scroll
    const bar = document.getElementById('progressBar');
    if (bar) bar.style.width = '0%';
    // Close hint
    const hint = document.getElementById('hintDetails');
    if (hint) hint.open = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Persist cleared state
    saveState();
  }
}

// Expose to window for onclick handlers in HTML
window.startTest = startTest;
window.toggleHint = toggleHint;
window.nextQuestion = nextQuestion;
window.prevQuestion = prevQuestion;
window.reviewBlock = reviewBlock;
window.continueToBlock = continueToBlock;
window.showFinalResults = showFinalResults;
window.downloadPDF = downloadPDF;
window.openShareModal = openShareModal;
window.openInviteModal = openInviteModal;
window.closeShareModal = closeShareModal;
window.shareToTelegram = shareToTelegram;
window.shareToWhatsApp = shareToWhatsApp;
window.shareToEmail = shareToEmail;
window.copyShareText = copyShareText;
window.saveResults = saveResults;
window.restartTest = restartTest;

function openPlanModal() {
  const m = document.getElementById('planModal');
  if (m) {
    // default start date = tomorrow
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const input = document.getElementById('planStartDate');
    if (input) input.value = d.toISOString().slice(0, 10);
    renderPlanPreview();
    m.style.display = 'flex';
  }
}
function closePlanModal() { const m = document.getElementById('planModal'); if (m) m.style.display = 'none'; }

function getPlanActions() {
  // Simple template based on priority block
  const priority = document.getElementById('priorityBlock')?.textContent || '';
  const base = {
    'Безопасность': [
      'Ежедневно: 10 минут “тихого времени” без экранов по очереди',
      '1 раз: проговорить одну личную границу и договориться, как её уважать',
      'Практика “я‑сообщений” в сложном разговоре'
    ],
    'Надёжность': [
      'Ежедневно: маленькое выполненное обещание (5–10 минут)',
      '1 раз: составить бытовой “чек‑лист недели”',
      'В конце недели: сверка ожиданий на следующую'
    ],
    'Связь': [
      'Ежедневно: 10 минут “итог дня” без телефонов',
      '3 раза/нед: активное слушание — 5 мин только слушать, 5 мин — говорить',
      '1 раз: совместное “свидание без экранов” 60–90 мин'
    ],
    'Рост': [
      'Ежедневно: 10 минут на личную цель (чтение/курс/спорт)',
      '1 раз: сверка ценностей и горизонта 6 месяцев',
      '1 раз: список “что даёт энергию” для каждого'
    ]
  };
  // fallback if not computed yet
  const key = ['Безопасность','Надёжность','Связь','Рост'].includes(priority) ? priority : 'Связь';
  return base[key];
}

function renderPlanPreview() {
  const startInput = document.getElementById('planStartDate');
  const container = document.getElementById('planPreview');
  if (!startInput || !container) return;
  const start = new Date(startInput.value || new Date());
  if (isNaN(start)) return;

  const actions = getPlanActions();
  const lines = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const day = d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', weekday: 'short' });
    const action = actions[i % actions.length];
    lines.push(`${day}: ${action}`);
  }
  container.textContent = lines.join('\n');
}

function generatePlanICS() {
  const startInput = document.getElementById('planStartDate');
  const start = new Date(startInput?.value || new Date());
  if (isNaN(start)) { alert('Укажите корректную дату начала.'); return; }
  const actions = getPlanActions();

  const pad = (n)=> String(n).padStart(2,'0');
  function formatICSDate(dt) {
    return dt.getUTCFullYear() + pad(dt.getUTCMonth()+1) + pad(dt.getUTCDate()) + 'T' + pad(dt.getUTCHours()) + pad(dt.getUTCMinutes()) + '00Z';
  }

  const uidBase = (Math.random().toString(36).slice(2)) + '@love-test';
  const now = new Date();
  const dtstamp = formatICSDate(now);
  const cal = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Love Test//EN'];

  for (let i = 0; i < 14; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    d.setHours(19, 0, 0, 0); // 19:00 локально
    const dtstart = formatICSDate(d);
    const action = actions[i % actions.length];
    cal.push('BEGIN:VEVENT');
    cal.push(`UID:${i}-${uidBase}`);
    cal.push(`DTSTAMP:${dtstamp}`);
    cal.push(`DTSTART:${dtstart}`);
    cal.push(`DURATION:PT30M`);
    cal.push(`SUMMARY:План на день #${i+1}`);
    cal.push(`DESCRIPTION:${action.replace(/\n/g, ' ')}`);
    cal.push('END:VEVENT');
  }
  cal.push('END:VCALENDAR');

  const blob = new Blob([cal.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'plan_14_days.ics';
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(a.href);
  a.remove();
}

function generatePlanPDF() {
  const startInput = document.getElementById('planStartDate');
  if (!startInput) return;
  const start = new Date(startInput.value || new Date());
  if (isNaN(start)) { alert('Укажите корректную дату начала.'); return; }
  const actions = getPlanActions();

  const items = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const day = d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', weekday: 'long' });
    const action = actions[i % actions.length];
    items.push({ text: [{ text: `День ${i+1}`, bold: true }, ` — ${day}\n${action}`], margin: [0, 2, 0, 2] });
  }

  const dd = {
    content: [
      { text: '14‑дневный план', style: 'header', alignment: 'center' },
      { text: `Старт: ${start.toLocaleDateString('ru-RU')}`, alignment: 'center', margin: [0,4,0,12] },
      ...items
    ],
    styles: {
      header: { fontSize: 16, bold: true }
    },
    defaultStyle: { font: 'Roboto' }
  };

  if (window.pdfMake && window.pdfMake.createPdf) {
    pdfMake.createPdf(dd).download('план_14_дней.pdf');
  } else {
    alert('PDF движок не загрузился. Обновите страницу и попробуйте ещё раз.');
  }
}

// Wire plan modal events
window.openPlanModal = openPlanModal;
window.closePlanModal = closePlanModal;
window.generatePlanICS = generatePlanICS;
window.generatePlanPDF = generatePlanPDF;
// Update preview on date change
document.addEventListener('change', (e)=>{ if (e.target && e.target.id === 'planStartDate') renderPlanPreview(); });