// Улучшенная навигация - дополнительный JavaScript

// Навигационное состояние
let navigationState = {
  currentView: 'intro',
  touchStartX: null,
  touchEndX: null,
  isNavigationOpen: false
};

// Блоки теста для навигации
const TEST_BLOCKS = [
  { id: 0, name: 'Безопасность', color: '#4a6b8a', questions: [0, 1, 2, 3, 4] },
  { id: 1, name: 'Надёжность', color: '#418e73', questions: [5, 6, 7, 8, 9] },
  { id: 2, name: 'Связь', color: '#d68a4e', questions: [10, 11, 12, 13, 14] },
  { id: 3, name: 'Рост', color: '#c45252', questions: [15, 16, 17, 18, 19] }
];

// Инициализация улучшенной навигации
document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  setupSwipeNavigation();
  setupKeyboardNavigation();
  updateNavigationState();
  
  // Обновляем навигацию каждый раз при изменении состояния
  const observer = new MutationObserver(updateNavigationState);
  observer.observe(document.body, { 
    childList: true, 
    subtree: true, 
    attributes: true, 
    attributeFilter: ['style', 'class'] 
  });
});

// Инициализация навигации
function initializeNavigation() {
  updateHeaderProgress();
  updateBreadcrumbs();
  generateBlocksGrid();
  updateProgressStats();
  
  // Закрытие модальных окон по клику вне их
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
      closeModal(e.target.id);
    }
    if (e.target.classList.contains('mobile-menu-overlay')) {
      toggleMobileMenu();
    }
  });
  
  // Закрытие модальных окон по Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeAllModals();
      if (navigationState.isNavigationOpen) {
        toggleMobileMenu();
      }
    }
  });
}

// Обновление состояния навигации
function updateNavigationState() {
  const currentView = getCurrentView();
  if (currentView !== navigationState.currentView) {
    navigationState.currentView = currentView;
    updateHeaderProgress();
    updateBreadcrumbs();
    updateMobileBottomNav();
    updateProgressStats();
  }
}

// Определение текущего представления
function getCurrentView() {
  if (document.getElementById('intro').style.display !== 'none') {
    return 'intro';
  } else if (document.getElementById('questionCard').style.display === 'block') {
    return 'question';
  } else if (document.querySelector('.block-result[style*="block"]')) {
    return 'blockResult';
  } else if (document.querySelector('.final-results[style*="block"]')) {
    return 'finalResults';
  }
  return 'intro';
}

// Обновление прогресса в хедере
function updateHeaderProgress() {
  const progressText = document.getElementById('headerProgressText');
  const progressPercent = document.getElementById('headerProgressPercent');
  const progressBar = document.getElementById('headerProgressBar');
  
  if (!progressText || !progressPercent || !progressBar) return;
  
  const view = navigationState.currentView;
  let text = 'Начало';
  let percentage = 0;
  
  if (view === 'question') {
    const questionIndex = currentState.currentQuestionIndex;
    const blockIndex = Math.floor(questionIndex / 5);
    const questionInBlock = (questionIndex % 5) + 1;
    
    text = `${TEST_BLOCKS[blockIndex].name} ${questionInBlock}/5`;
    percentage = ((questionIndex + 1) / 20) * 100;
  } else if (view === 'blockResult') {
    const blockIndex = getCurrentBlockResult();
    text = `${TEST_BLOCKS[blockIndex].name} завершён`;
    percentage = ((blockIndex + 1) * 5 / 20) * 100;
  } else if (view === 'finalResults') {
    text = 'Результаты';
    percentage = 100;
  }
  
  progressText.textContent = text;
  progressPercent.textContent = Math.round(percentage) + '%';
  progressBar.style.width = percentage + '%';
  
  // Обновляем ARIA атрибуты
  progressBar.setAttribute('aria-valuenow', percentage);
  progressBar.setAttribute('aria-valuetext', text);
}

// Обновление хлебных крошек
function updateBreadcrumbs() {
  const currentBreadcrumb = document.getElementById('currentBreadcrumb');
  if (!currentBreadcrumb) return;
  
  const view = navigationState.currentView;
  let text = 'Введение';
  
  if (view === 'question') {
    const questionIndex = currentState.currentQuestionIndex;
    const blockIndex = Math.floor(questionIndex / 5);
    const questionInBlock = (questionIndex % 5) + 1;
    text = `${TEST_BLOCKS[blockIndex].name} → Вопрос ${questionInBlock}`;
  } else if (view === 'blockResult') {
    const blockIndex = getCurrentBlockResult();
    text = `${TEST_BLOCKS[blockIndex].name} → Результат блока`;
  } else if (view === 'finalResults') {
    text = 'Финальные результаты';
  }
  
  currentBreadcrumb.querySelector('span').textContent = text;
}

// Обновление мобильной навигации
function updateMobileBottomNav() {
  const bottomNav = document.getElementById('mobileBottomNav');
  const prevBtn = document.getElementById('mobilePrevBtn');
  const nextBtn = document.getElementById('mobileNextBtn');
  const indicator = document.getElementById('mobileQuestionIndicator');
  
  if (!bottomNav || navigationState.currentView !== 'question') {
    bottomNav?.classList.remove('active');
    return;
  }
  
  bottomNav.classList.add('active');
  
  const questionIndex = currentState.currentQuestionIndex;
  prevBtn.disabled = questionIndex === 0;
  indicator.textContent = `${questionIndex + 1}/20`;
  
  // Обновляем текст кнопки "Далее"
  const nextBtnText = nextBtn.querySelector('span');
  if ((questionIndex + 1) % 5 === 0 && questionIndex < 19) {
    nextBtnText.textContent = 'К результату';
  } else if (questionIndex === 19) {
    nextBtnText.textContent = 'Завершить';
  } else {
    nextBtnText.textContent = 'Далее';
  }
}

// Генерация сетки блоков для модального окна
function generateBlocksGrid() {
  const blocksGrid = document.getElementById('blocksGrid');
  if (!blocksGrid) return;
  
  blocksGrid.innerHTML = '';
  
  TEST_BLOCKS.forEach((block, index) => {
    const blockElement = document.createElement('div');
    blockElement.className = 'block-item';
    blockElement.style.borderLeftColor = block.color;
    
    // Определяем состояние блока
    const completedQuestions = block.questions.filter(q => 
      currentState.answers.hasOwnProperty(q)
    ).length;
    
    const currentQuestionIndex = currentState.currentQuestionIndex;
    const isCurrent = block.questions.includes(currentQuestionIndex);
    const isCompleted = completedQuestions === 5;
    
    if (isCompleted) {
      blockElement.classList.add('completed');
    } else if (isCurrent) {
      blockElement.classList.add('current');
    }
    
    blockElement.innerHTML = `
      <div class="block-title">${block.name}</div>
      <div class="block-progress">${completedQuestions}/5 вопросов</div>
    `;
    
    // Добавляем возможность перехода к блоку (если он доступен)
    if (completedQuestions > 0 || isCurrent) {
      blockElement.style.cursor = 'pointer';
      blockElement.onclick = () => {
        const firstQuestion = block.questions[0];
        if (firstQuestion <= currentState.currentQuestionIndex) {
          showQuestion(firstQuestion);
          closeModal('navigationModal');
        }
      };
    }
    
    blocksGrid.appendChild(blockElement);
  });
}

// Обновление статистики прогресса
function updateProgressStats() {
  const answeredCount = document.getElementById('answeredCount');
  const completedBlocks = document.getElementById('completedBlocks');
  const overallProgress = document.getElementById('overallProgress');
  
  if (!answeredCount) return;
  
  const totalAnswered = Object.keys(currentState.answers).length;
  const blocksCompleted = TEST_BLOCKS.filter(block => 
    block.questions.every(q => currentState.answers.hasOwnProperty(q))
  ).length;
  const progress = Math.round((totalAnswered / 20) * 100);
  
  answeredCount.textContent = `${totalAnswered} из 20`;
  completedBlocks.textContent = `${blocksCompleted} из 4`;
  overallProgress.textContent = `${progress}%`;
}

// Настройка swipe навигации
function setupSwipeNavigation() {
  const container = document.querySelector('.container');
  if (!container) return;
  
  container.addEventListener('touchstart', function(e) {
    navigationState.touchStartX = e.touches[0].clientX;
  }, { passive: true });
  
  container.addEventListener('touchend', function(e) {
    if (!navigationState.touchStartX) return;
    
    navigationState.touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
  }, { passive: true });
}

// Обработка свайпов
function handleSwipe() {
  const { touchStartX, touchEndX } = navigationState;
  if (!touchStartX || !touchEndX) return;
  
  const swipeThreshold = 50; // минимальная дистанция для свайпа
  const diffX = touchStartX - touchEndX;
  
  // Только для экрана вопросов
  if (navigationState.currentView !== 'question') return;
  
  if (Math.abs(diffX) > swipeThreshold) {
    if (diffX > 0) {
      // Свайп влево - следующий вопрос
      if (currentState.currentQuestionIndex < QUESTIONS.length - 1) {
        nextQuestion();
      }
    } else {
      // Свайп вправо - предыдущий вопрос
      if (currentState.currentQuestionIndex > 0) {
        prevQuestion();
      }
    }
  }
  
  // Сброс значений
  navigationState.touchStartX = null;
  navigationState.touchEndX = null;
}

// Настройка клавиатурной навигации
function setupKeyboardNavigation() {
  document.addEventListener('keydown', function(e) {
    // Игнорируем, если фокус на input или textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }
    
    switch(e.key) {
      case 'ArrowLeft':
        if (navigationState.currentView === 'question') {
          e.preventDefault();
          if (currentState.currentQuestionIndex > 0) {
            prevQuestion();
          }
        }
        break;
        
      case 'ArrowRight':
        if (navigationState.currentView === 'question') {
          e.preventDefault();
          if (currentState.currentQuestionIndex < QUESTIONS.length - 1) {
            nextQuestion();
          }
        }
        break;
        
      case 'Home':
        e.preventDefault();
        goHome();
        break;
        
      case '?':
        e.preventDefault();
        showHelpModal();
        break;
    }
  });
}

// Навигационные функции

// Возвращение на главную
function goHome() {
  document.getElementById('intro').style.display = 'block';
  document.getElementById('questionCard').style.display = 'none';
  
  // Скрываем все результаты
  document.querySelectorAll('.block-result, .final-results').forEach(el => {
    el.style.display = 'none';
  });
  
  navigationState.currentView = 'intro';
  updateNavigationState();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Показ модального окна навигации
function showNavigationMenu() {
  generateBlocksGrid();
  updateProgressStats();
  showModal('navigationModal');
}

// Показ обзора теста
function showTestOverview() {
  showNavigationMenu();
}

// Показ прогресса
function showProgress() {
  generateBlocksGrid();
  updateProgressStats();
  showModal('navigationModal');
}

// Показ модального окна помощи
function showHelpModal() {
  showModal('helpModal');
}

// Общие функции для модальных окон
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    // Фокус на первом интерактивном элементе
    const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 100);
    }
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay.active').forEach(modal => {
    modal.classList.remove('active');
  });
}

// Переключение мобильного меню
function toggleMobileMenu() {
  const overlay = document.getElementById('mobileMenuOverlay');
  const toggle = document.getElementById('mobileMenuToggle');
  
  navigationState.isNavigationOpen = !navigationState.isNavigationOpen;
  
  if (navigationState.isNavigationOpen) {
    overlay.classList.add('active');
    toggle.classList.add('active');
    document.body.style.overflow = 'hidden'; // Блокируем скролл
  } else {
    overlay.classList.remove('active');
    toggle.classList.remove('active');
    document.body.style.overflow = ''; // Разблокируем скролл
  }
}

// Получение текущего индекса блока результатов
function getCurrentBlockResult() {
  const blockResults = document.querySelectorAll('.block-result');
  for (let i = 0; i < blockResults.length; i++) {
    if (blockResults[i].style.display === 'block') {
      return i;
    }
  }
  return 0;
}

// Расширения существующих функций

// Переопределяем существующую функцию startTest
const originalStartTest = window.startTest;
window.startTest = function() {
  originalStartTest?.();
  updateNavigationState();
};

// Переопределяем функции навигации по вопросам
const originalNextQuestion = window.nextQuestion;
window.nextQuestion = function() {
  originalNextQuestion?.();
  updateNavigationState();
};

const originalPrevQuestion = window.prevQuestion;
window.prevQuestion = function() {
  originalPrevQuestion?.();
  updateNavigationState();
};

// Переопределяем функцию перезапуска теста с подтверждением
const originalRestartTest = window.restartTest;
window.restartTest = function() {
  if (confirm('Вы уверены, что хотите начать тест заново? Все ваши ответы будут удалены.')) {
    originalRestartTest?.();
    updateNavigationState();
  }
};

// Добавляем функцию для плавных переходов
function addTransitionEffect(element, direction = 'fade') {
  if (!element) return;
  
  element.style.transition = 'all 0.3s ease';
  
  if (direction === 'slideLeft') {
    element.style.transform = 'translateX(-20px)';
    element.style.opacity = '0';
  } else if (direction === 'slideRight') {
    element.style.transform = 'translateX(20px)';
    element.style.opacity = '0';
  } else {
    element.style.opacity = '0';
  }
  
  setTimeout(() => {
    element.style.transform = 'translateX(0)';
    element.style.opacity = '1';
  }, 50);
  
  setTimeout(() => {
    element.style.transition = '';
  }, 350);
}

// Функция для сохранения позиции скролла
let scrollPositions = new Map();

function saveScrollPosition(key) {
  scrollPositions.set(key, window.pageYOffset);
}

function restoreScrollPosition(key) {
  const position = scrollPositions.get(key);
  if (position !== undefined) {
    window.scrollTo({ top: position, behavior: 'smooth' });
  }
}

// Функция для активации touch-friendly элементов
function enhanceTouchInteraction() {
  // Добавляем тактильный фидбек для кнопок
  document.querySelectorAll('.btn, .option, .action-btn').forEach(element => {
    element.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.98)';
    }, { passive: true });
    
    element.addEventListener('touchend', function() {
      this.style.transform = 'scale(1)';
    }, { passive: true });
  });
}

// Инициализируем touch-friendly функции
document.addEventListener('DOMContentLoaded', enhanceTouchInteraction);

// Добавляем поддержку для голосовых команд (экспериментально)
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  
  function startVoiceNavigation() {
    if (recognition) {
      recognition.stop();
    }
    
    recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onresult = function(event) {
      const command = event.results[0][0].transcript.toLowerCase();
      
      if (command.includes('далее') || command.includes('следующий')) {
        nextQuestion();
      } else if (command.includes('назад') || command.includes('предыдущий')) {
        prevQuestion();
      } else if (command.includes('главная') || command.includes('домой')) {
        goHome();
      } else if (command.includes('помощь')) {
        showHelpModal();
      }
    };
    
    recognition.start();
  }
  
  // Добавляем кнопку голосового управления (опционально)
  // Можно раскомментировать для активации
  /*
  const voiceButton = document.createElement('button');
  voiceButton.className = 'action-btn';
  voiceButton.innerHTML = '🎤';
  voiceButton.onclick = startVoiceNavigation;
  voiceButton.setAttribute('aria-label', 'Голосовое управление');
  document.querySelector('.desktop-actions')?.appendChild(voiceButton);
  */
}

// Автосохранение позиции скролла при навигации
window.addEventListener('beforeunload', function() {
  saveScrollPosition('current');
});

// Функция для отслеживания пользовательской активности
let lastActivityTime = Date.now();
let activityTracker = null;

function trackUserActivity() {
  lastActivityTime = Date.now();
}

function startActivityTracking() {
  document.addEventListener('mousemove', trackUserActivity);
  document.addEventListener('keypress', trackUserActivity);
  document.addEventListener('touchstart', trackUserActivity);
  document.addEventListener('click', trackUserActivity);
  
  // Проверяем активность каждые 30 секунд
  activityTracker = setInterval(() => {
    const inactiveDuration = Date.now() - lastActivityTime;
    
    // Если пользователь неактивен более 5 минут, показываем напоминание
    if (inactiveDuration > 5 * 60 * 1000) {
      if (navigationState.currentView === 'question') {
        console.log('Пользователь неактивен, показываем напоминание о сохранении');
        // Здесь можно добавить уведомление о сохранении прогресса
      }
    }
  }, 30000);
}

// Запускаем отслеживание активности
document.addEventListener('DOMContentLoaded', startActivityTracking);

// Экспортируем функции для использования в основном скрипте
window.navigationHelpers = {
  updateNavigationState,
  goHome,
  showNavigationMenu,
  showHelpModal,
  toggleMobileMenu,
  addTransitionEffect,
  saveScrollPosition,
  restoreScrollPosition
};