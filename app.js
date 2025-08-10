// Configuration
const TEST_URL = window.location.href;

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

// Init
window.addEventListener('DOMContentLoaded', () => {
  // Accessibility roles
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-valuemin', '0');
    progressBar.setAttribute('aria-valuemax', '100');
  }

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
  clearState(); // Очищаем состояние перед началом
  
  // Скрываем заставку
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    loadingScreen.style.opacity = '0';
    loadingScreen.style.transition = 'opacity 0.8s ease';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 800);
  }
  
  // Скрываем все остальные экраны и показываем вопросы
  document.getElementById('intro').style.display = 'none';
  document.getElementById('question-container').style.display = 'block';
  
  // Показываем первый вопрос
  showQuestion(0);
}

function showQuestion(index) {
  const question = QUESTIONS[index];
  const card = document.getElementById('questionCard');
  const optionsContainer = document.getElementById('optionsContainer');
  const nextBtn = document.getElementById('nextBtn');

  card.style.display = 'block';
  document.getElementById('blockTag').textContent = question.block;
  document.getElementById('questionNumber').textContent = `Вопрос ${index % 5 + 1} из 5`;
  document.getElementById('questionText').textContent = question.text;
  
  // Обновляем текст кнопки На последнем вопросе
  if (index === 19) {
    nextBtn.innerHTML = 'Получить результаты →';
    nextBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
  } else {
    nextBtn.innerHTML = 'Далее →';
    nextBtn.style.background = '';
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
  
  // Изменяем текст кнопки на последнем вопросе
  if (index === 19) { // Последний вопрос (индекс 19 = 20-й вопрос)
    nextBtn.innerHTML = 'Получить результаты →';
    nextBtn.className = 'nav-btn nav-btn-forward btn-final';
  } else {
    nextBtn.innerHTML = 'Далее →';
    nextBtn.className = 'nav-btn nav-btn-forward';
  }

  currentState.currentQuestionIndex = index;
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleHint() {
  console.log('toggleHint called'); // Отладка
  const hintContent = document.getElementById('hintContent');
  const toggleButton = document.querySelector('.hint-toggle');
  const hintLabel = toggleButton?.querySelector('.hint-label');
  
  console.log('Elements found:', { hintContent, toggleButton, hintLabel }); // Отладка
  
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
  } else {
    console.error('hintContent not found!'); // Отладка
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
  if (answer === undefined) {
    alert('Пожалуйста, выберите ответ на вопрос.');
    return;
  }

  const currentIndex = currentState.currentQuestionIndex;
  
  // Проверяем, завершили ли мы блок (5 вопросов)
  if ((currentIndex + 1) % 5 === 0) {
    const blockIndex = Math.floor(currentIndex / 5);
    calculateBlockResult(blockIndex);
    showCompactBlockResult(blockIndex);
  }
  
  // Если это последний вопрос (индекс 19)
  if (currentIndex === 19) {
    // Обновляем индекс для последнего вопроса
    currentState.currentQuestionIndex = 20;
    saveState();
    
    // Показываем финальные результаты
    showFinalResults();
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
    
    // Обновляем компактные блоки результатов
    updateCompactBlocks();
  }
}

// Показываем компактный блок результата внизу экрана
function showCompactBlockResult(blockIndex) {
  const blockNumber = blockIndex + 1;
  const compactBlock = document.getElementById(`blockResult${blockNumber}`);
  if (compactBlock) {
    compactBlock.style.display = 'block';
    
    // Обновляем информацию в компактном блоке
    updateCompactBlockInfo(blockIndex);
    
    // Плавно прокручиваем к блоку
    setTimeout(() => {
      compactBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
  // Полностью скрываем все элементы теста
  document.getElementById('intro').style.display = 'none';
  document.getElementById('questionCard').style.display = 'none';
  document.querySelector('.progress-container').style.display = 'none';
  
  // Скрываем все компактные блоки результатов
  for (let i = 1; i <= 4; i++) {
    const blockResult = document.getElementById(`blockResult${i}`);
    if (blockResult) blockResult.style.display = 'none';
  }
  
  // Показываем финальные результаты на всю страницу
  const finalResults = document.getElementById('finalResults');
  finalResults.style.display = 'block';
  finalResults.style.position = 'relative';
  finalResults.style.zIndex = '10';
  finalResults.style.background = '#f8f9fa';
  finalResults.style.minHeight = '100vh';
  finalResults.style.paddingTop = '2rem';
  
  calculateOverallResult();
  
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

  // PDF
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

function downloadPDF() {
  const element = document.getElementById('pdfReport');
  const opt = {
    margin: 10,
    filename: 'Результаты_теста_отношений.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  html2pdf()
    .set(opt)
    .from(element)
    .save()
    .then(() => console.log('PDF успешно сохранен'))
    .catch((error) => {
      console.error('Ошибка при генерации PDF:', error);
      alert('Произошла ошибка при создании PDF. Попробуйте еще раз.');
    });
}

function safeOpen(url) {
  const newWin = window.open(url, '_blank');
  if (newWin) newWin.opener = null;
}

function shareToTelegram() {
  const baseText = 'Пройди тест на зрелость отношений — давай лучше поймём наши сильные и слабые стороны. Тест от Евгения Климова:';
  const message = `${baseText}\n${TEST_URL}`.normalize('NFC');
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(TEST_URL)}&text=${encodeURIComponent(message)}`;
  safeOpen(shareUrl);
}

function shareToWhatsApp() {
  const text = `Пройди тест на зрелость отношений — давай лучше поймём наши сильные и слабые стороны. Тест от Евгения Климова: ${TEST_URL}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  safeOpen(whatsappUrl);
}

function restartTest() {
  if (confirm('Вы уверены, что хотите начать тест заново? Все ваши ответы будут потеряны.')) {
    clearState();
    document.getElementById('finalResults').style.display = 'none';
    document.getElementById('intro').style.display = 'block';
    updateProgress();
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
// Начало теста - функция уже определена выше

window.toggleHint = toggleHint;
window.startTest = startTest;
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
    // Инициализация состояния
    currentState.currentQuestionIndex = 0;
    currentState.answers = {};
    currentState.blockResults = { 0: null, 1: null, 2: null, 3: null };
    
    // Скрыть все элементы (включая intro) - покажем intro только после заставки
    document.getElementById('intro').style.display = 'none';
    document.getElementById('questionCard').style.display = 'none';
    document.getElementById('finalResults').style.display = 'none';
    document.querySelectorAll('.block-result-compact').forEach(el => el.style.display = 'none');
    
    // Скрыть прогресс-бар на главной
    document.querySelector('.progress-container').style.display = 'none';
    
    initCompactBlocks();
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
        text: '“Безопасность — это когда вы можете быть собой без страха осуждения”',
        attribution: '— Основа здоровых отношений'
    },
    {
        text: '“Отношения становятся надёжными, когда оба партнёра держат слово”',
        attribution: '— Основа доверия'
    },
    {
        text: '“Эмоциональная связь — это сердце любых зрелых отношений”',
        attribution: '— Глубина связи'
    },
    {
        text: '“Лучшие отношения те, в которых оба растут и становятся лучше”',
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
    const loadingSteps = [
        'Подготовка вопросов...',
        'Настройка теста...',
        'Инициализация системы...',
        'Подготовка результатов...',
        'Готово к работе!'
    ];

    const loadingProgressBar = document.getElementById('loadingProgressBar');
    const loadingText = document.getElementById('loadingText');
    
    let currentStep = 0;
    
    function animateStep() {
        if (currentStep >= loadingSteps.length) {
            // Завершаем анимацию
            setTimeout(() => {
                showStartButton();
            }, 500);
            return;
        }

        const progress = ((currentStep + 1) / loadingSteps.length) * 100;
        
        // Обновляем прогресс-бар
        if (loadingProgressBar) {
            loadingProgressBar.style.width = `${progress}%`;
        }
        
        // Обновляем текст
        if (loadingText) {
            loadingText.textContent = loadingSteps[currentStep];
        }
        
        currentStep++;
        
        // Переход к следующему шагу
        setTimeout(animateStep, 1200);
    }

    // Начинаем анимацию через небольшую задержку
    setTimeout(() => {
        animateStep();
    }, 1000);
}

function showStartButton() {
    const loadingProgressBar = document.getElementById('loadingProgressBar');
    const loadingText = document.getElementById('loadingText');
    const startButton = document.getElementById('startButton');
    const testInfo = document.getElementById('testInfo');

    // Скрываем прогресс бар
    if (loadingProgressBar) {
        loadingProgressBar.parentElement.style.opacity = '0';
        loadingProgressBar.parentElement.style.transition = 'opacity 0.5s ease';
    }
    
    // Скрываем текст загрузки
    if (loadingText) {
        loadingText.style.opacity = '0';
        loadingText.style.transition = 'opacity 0.5s ease';
    }

    // Показываем кнопку старта и информацию
    setTimeout(() => {
        if (startButton) {
            startButton.classList.remove('hidden');
        }
        
        if (testInfo) {
            testInfo.classList.remove('hidden');
        }
        
        loadingState.isLoading = false;
    }, 600);
}

// Обновленные экспорты функций (кнопка теперь вызывает startTest напрямую)
// window.handleCircleClick больше не нужен

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация приложения
    initializeApp();
    
    // Настраиваем прогресс-кольцо и запускаем анимированную загрузку
    const progressRing = document.getElementById('progressRing');
    if (progressRing) {
        const circumference = 2 * Math.PI * 80;
        progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
        progressRing.style.strokeDashoffset = circumference;
    }
    
    // Запускаем анимированную загрузку
    startLoadingAnimation();
});

window.continueToBlock = continueToBlock;
window.showFinalResults = showFinalResults;
window.downloadPDF = downloadPDF;
window.shareToTelegram = shareToTelegram;
window.shareToWhatsApp = shareToWhatsApp;
window.restartTest = restartTest;
// Функция toggleHint уже определена выше

window.toggleBlockResult = toggleBlockResult;
window.toggleHint = toggleHint;