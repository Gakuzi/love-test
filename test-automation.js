// Автоматический тест психологического приложения
console.log('🧪 Начинаем автоматическое тестирование приложения...');

// Конфигурация тестирования
const TEST_CONFIG = {
    waitTime: 2000, // Время ожидания между действиями
    loadingTestTime: 10000, // Время для полного тестирования загрузки
    scrollDelay: 500
};

// Утилиты для тестирования
const TestUtils = {
    wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    
    log: (message, type = 'info') => {
        const colors = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️',
            test: '🔬'
        };
        console.log(`${colors[type]} ${message}`);
    },
    
    click: async (selector) => {
        const element = document.querySelector(selector);
        if (element) {
            element.click();
            TestUtils.log(`Клик на ${selector}`, 'test');
            await TestUtils.wait(500);
            return true;
        }
        TestUtils.log(`Элемент ${selector} не найден`, 'error');
        return false;
    },
    
    checkElement: (selector, description) => {
        const element = document.querySelector(selector);
        const exists = element && element.offsetParent !== null;
        TestUtils.log(`${description}: ${exists ? 'присутствует' : 'отсутствует'}`, exists ? 'success' : 'error');
        return exists;
    },
    
    checkText: (selector, expectedText, description) => {
        const element = document.querySelector(selector);
        if (element && element.textContent.includes(expectedText)) {
            TestUtils.log(`${description}: текст корректный`, 'success');
            return true;
        }
        TestUtils.log(`${description}: текст некорректный`, 'error');
        return false;
    }
};

// Главная функция тестирования
async function runFullTest() {
    const results = {
        passed: 0,
        failed: 0,
        tests: []
    };
    
    function addTest(name, passed) {
        results.tests.push({ name, passed });
        if (passed) results.passed++;
        else results.failed++;
    }
    
    try {
        // 1. Тест заставки и загрузки
        TestUtils.log('=== ТЕСТ 1: ЗАСТАВКА И ЗАГРУЗКА ===', 'test');
        
        // Проверяем наличие заставки
        addTest('Современная заставка отображается', TestUtils.checkElement('.modern-loading-screen', 'Современная заставка'));
        addTest('Контейнер прогресса присутствует', TestUtils.checkElement('#progressContainer', 'Контейнер прогресса'));
        addTest('Цитата присутствует', TestUtils.checkElement('#rotatingQuote', 'Вращающаяся цитата'));
        
        // Ждём завершения загрузки
        TestUtils.log('Ожидаем завершения анимации загрузки...', 'info');
        await TestUtils.wait(TEST_CONFIG.loadingTestTime);
        
        // Проверяем появление кнопки старта
        addTest('Кнопка старта появилась', TestUtils.checkElement('#startButton', 'Кнопка старта'));
        addTest('Сообщение о завершении появилось', TestUtils.checkElement('#completionMessage', 'Сообщение о завершении'));
        
        // 2. Тест запуска теста
        TestUtils.log('=== ТЕСТ 2: ЗАПУСК ТЕСТА ===', 'test');
        
        // Кликаем кнопку старта
        const startClicked = await TestUtils.click('#startButton');
        addTest('Клик по кнопке старта', startClicked);
        
        await TestUtils.wait(TEST_CONFIG.waitTime);
        
        // Проверяем переход к вопросам
        addTest('Переход к вопросам', TestUtils.checkElement('#question-container', 'Контейнер вопросов'));
        addTest('Первый вопрос отображается', TestUtils.checkElement('#questionCard', 'Карточка вопроса'));
        addTest('Прогресс-бар присутствует', TestUtils.checkElement('#progressBar', 'Прогресс-бар'));
        
        // 3. Тест навигации по вопросам
        TestUtils.log('=== ТЕСТ 3: НАВИГАЦИЯ ПО ВОПРОСАМ ===', 'test');
        
        // Проверяем текущий вопрос
        addTest('Номер вопроса корректный', TestUtils.checkText('#questionNumber', 'Вопрос 1 из 5', 'Номер вопроса'));
        addTest('Блок тега присутствует', TestUtils.checkElement('#blockTag', 'Тег блока'));
        
        // Тестируем выбор ответа и переход
        for (let i = 0; i < 5; i++) {
            TestUtils.log(`Тестируем вопрос ${i + 1}...`, 'info');
            
            // Выбираем первый вариант ответа
            const optionClicked = await TestUtils.click('.option');
            addTest(`Выбор ответа на вопрос ${i + 1}`, optionClicked);
            
            await TestUtils.wait(500);
            
            // Проверяем выделение опции
            addTest(`Опция выделена на вопросе ${i + 1}`, TestUtils.checkElement('.option.selected', 'Выделенная опция'));
            
            // Кликаем "Далее"
            const nextClicked = await TestUtils.click('#nextBtn');
            addTest(`Переход от вопроса ${i + 1}`, nextClicked);
            
            await TestUtils.wait(TEST_CONFIG.waitTime);
            
            // Проверяем промежуточные результаты для блоков
            if ((i + 1) % 5 === 0 && i < 19) {
                const blockNum = Math.floor(i / 5) + 1;
                addTest(`Промежуточные результаты блока ${blockNum}`, 
                    TestUtils.checkElement(`#blockResult${blockNum}`, `Результаты блока ${blockNum}`));
                
                // Кликаем "Продолжить"
                await TestUtils.wait(1000);
                const continueClicked = await TestUtils.click('#continueBtn');
                addTest(`Продолжение после блока ${blockNum}`, continueClicked);
                await TestUtils.wait(TEST_CONFIG.waitTime);
            }
        }
        
        // 4. Тест остальных блоков (упрощённо)
        TestUtils.log('=== ТЕСТ 4: ОСТАЛЬНЫЕ БЛОКИ ===', 'test');
        
        for (let block = 2; block <= 4; block++) {
            TestUtils.log(`Блок ${block}...`, 'info');
            
            for (let q = 0; q < 5; q++) {
                await TestUtils.click('.option');
                await TestUtils.wait(300);
                await TestUtils.click('#nextBtn');
                await TestUtils.wait(500);
            }
            
            if (block < 4) {
                // Промежуточные результаты
                await TestUtils.wait(1000);
                addTest(`Результаты блока ${block}`, TestUtils.checkElement(`#blockResult${block}`, `Блок ${block} результаты`));
                await TestUtils.click('#continueBtn');
                await TestUtils.wait(TEST_CONFIG.waitTime);
            }
        }
        
        // 5. Тест финальных результатов
        TestUtils.log('=== ТЕСТ 5: ФИНАЛЬНЫЕ РЕЗУЛЬТАТЫ ===', 'test');
        
        await TestUtils.wait(2000);
        
        addTest('Финальные результаты отображаются', TestUtils.checkElement('#finalResults', 'Финальные результаты'));
        addTest('Общий балл присутствует', TestUtils.checkElement('#overallScore', 'Общий балл'));
        addTest('Рекомендации присутствуют', TestUtils.checkElement('#recommendations', 'Рекомендации'));
        
        // 6. Тест функции "Начать сначала"
        TestUtils.log('=== ТЕСТ 6: ФУНКЦИЯ ПЕРЕЗАПУСКА ===', 'test');
        
        const restartClicked = await TestUtils.click('#restartBtn');
        addTest('Кнопка "Начать сначала" работает', restartClicked);
        
        await TestUtils.wait(TEST_CONFIG.waitTime);
        
        addTest('Возврат к заставке', TestUtils.checkElement('#loadingScreen', 'Заставка после перезапуска'));
        
        // 7. Тест кнопки помощи
        TestUtils.log('=== ТЕСТ 7: КНОПКА ПОМОЩИ ===', 'test');
        
        addTest('Кнопка помощи присутствует', TestUtils.checkElement('.help-btn-beautiful', 'Кнопка помощи'));
        
        const helpClicked = await TestUtils.click('.help-btn-beautiful');
        addTest('Клик по кнопке помощи', helpClicked);
        
        await TestUtils.wait(1000);
        
        addTest('Модальное окно помощи открылось', TestUtils.checkElement('#helpModal.show', 'Модальное окно помощи'));
        
        // Закрываем модальное окно
        await TestUtils.click('#helpModal .close');
        await TestUtils.wait(500);
        
    } catch (error) {
        TestUtils.log(`Ошибка во время тестирования: ${error.message}`, 'error');
        addTest('Обработка ошибок', false);
    }
    
    // Финальный отчёт
    TestUtils.log('=== ИТОГОВЫЙ ОТЧЁТ ===', 'test');
    TestUtils.log(`Всего тестов: ${results.tests.length}`, 'info');
    TestUtils.log(`Пройдено: ${results.passed}`, 'success');
    TestUtils.log(`Провалено: ${results.failed}`, 'error');
    TestUtils.log(`Процент успеха: ${Math.round((results.passed / results.tests.length) * 100)}%`, 'info');
    
    if (results.failed > 0) {
        TestUtils.log('Проваленные тесты:', 'warning');
        results.tests.filter(t => !t.passed).forEach(t => {
            TestUtils.log(`- ${t.name}`, 'error');
        });
    }
    
    const overall = results.failed === 0 ? 'success' : 'warning';
    TestUtils.log(`Общий статус: ${results.failed === 0 ? 'ВСЕ ТЕСТЫ ПРОЙДЕНЫ' : 'ЕСТЬ ПРОБЛЕМЫ'}`, overall);
    
    return results;
}

// Функция быстрого тестирования только критичных функций
async function runQuickTest() {
    TestUtils.log('🚀 Быстрое тестирование критичных функций...', 'test');
    
    const tests = [
        () => TestUtils.checkElement('.modern-loading-screen', 'Современная заставка загружается'),
        () => TestUtils.checkElement('#progressContainer', 'Контейнер прогресса присутствует'),
        () => TestUtils.checkElement('#rotatingQuote', 'Цитата присутствует'),
        () => TestUtils.checkElement('.help-btn-beautiful', 'Кнопка помощи доступна')
    ];
    
    let passed = 0;
    tests.forEach((test, i) => {
        if (test()) {
            passed++;
            TestUtils.log(`Тест ${i + 1}: ПРОЙДЕН`, 'success');
        } else {
            TestUtils.log(`Тест ${i + 1}: ПРОВАЛЕН`, 'error');
        }
    });
    
    TestUtils.log(`Быстрое тестирование: ${passed}/${tests.length} тестов пройдено`, passed === tests.length ? 'success' : 'warning');
    return passed === tests.length;
}

// Экспорт функций для использования в консоли
window.TestSuite = {
    runFullTest,
    runQuickTest,
    TestUtils
};

// Автоматический запуск быстрого теста при загрузке (если нужен)
document.addEventListener('DOMContentLoaded', function() {
    // Автоматический запуск можно включить при необходимости
    // setTimeout(() => runQuickTest(), 3000);
});

console.log('✅ Система тестирования готова!');
console.log('Доступные команды:');
console.log('- TestSuite.runQuickTest() - быстрое тестирование');
console.log('- TestSuite.runFullTest() - полное тестирование');
console.log('- TestSuite.TestUtils - утилиты для ручного тестирования');