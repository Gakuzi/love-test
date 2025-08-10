// Автоматический тест всех функций приложения
// Запускать в консоли браузера после загрузки страницы

class TestRunner {
    constructor() {
        this.results = [];
        this.passed = 0;
        this.failed = 0;
    }

    log(message, isError = false) {
        const timestamp = new Date().toLocaleTimeString();
        const logMessage = `[${timestamp}] ${message}`;
        
        if (isError) {
            console.error(logMessage);
            this.results.push({ time: timestamp, message, status: 'FAILED' });
            this.failed++;
        } else {
            console.log(logMessage);
            this.results.push({ time: timestamp, message, status: 'PASSED' });
            this.passed++;
        }
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async testElement(selector, testName) {
        try {
            const element = document.querySelector(selector);
            if (!element) {
                this.log(`❌ ${testName}: Элемент ${selector} не найден`, true);
                return false;
            }
            this.log(`✅ ${testName}: Элемент ${selector} найден`);
            return element;
        } catch (error) {
            this.log(`❌ ${testName}: Ошибка при поиске ${selector} - ${error.message}`, true);
            return false;
        }
    }

    async testFunction(functionName, testName) {
        try {
            if (typeof window[functionName] !== 'function') {
                this.log(`❌ ${testName}: Функция ${functionName} не найдена`, true);
                return false;
            }
            this.log(`✅ ${testName}: Функция ${functionName} существует`);
            return true;
        } catch (error) {
            this.log(`❌ ${testName}: Ошибка проверки функции ${functionName} - ${error.message}`, true);
            return false;
        }
    }

    async testStartupScreen() {
        this.log("🔍 Тестирование начальной заставки...");
        
        // Проверка элементов заставки
        await this.testElement('#loadingScreen', 'Заставка - основной контейнер');
        await this.testElement('.start-button-section', 'Заставка - секция кнопки');
        await this.testElement('.start-test-btn', 'Заставка - кнопка старт');
        await this.testElement('.progress-circle', 'Заставка - прогресс круг');
        await this.testElement('.progress-percent', 'Заставка - процент загрузки');
        await this.testElement('.progress-label', 'Заставка - лейбл статуса');
        
        // Проверка функций заставки
        await this.testFunction('hideLoadingAndStart', 'Заставка - функция старта');
        await this.testFunction('startLoadingSequence', 'Заставка - функция загрузки');
    }

    async testNavigation() {
        this.log("🔍 Тестирование навигации...");
        
        // Проверка основных функций навигации
        await this.testFunction('nextQuestion', 'Навигация - следующий вопрос');
        await this.testFunction('prevQuestion', 'Навигация - предыдущий вопрос');
        await this.testFunction('startTest', 'Навигация - запуск теста');
        await this.testFunction('showResults', 'Навигация - показ результатов');
        
        // Проверка элементов навигации
        await this.testElement('#questionCard', 'Навигация - карточка вопроса');
        await this.testElement('.btn-next', 'Навигация - кнопка Далее');
        await this.testElement('.btn-prev', 'Навигация - кнопка Назад');
        await this.testElement('.progress-container', 'Навигация - контейнер прогресса');
    }

    async testQuestionSystem() {
        this.log("🔍 Тестирование системы вопросов...");
        
        // Проверка элементов вопросов
        await this.testElement('#questionText', 'Вопросы - текст вопроса');
        await this.testElement('#answerOptions', 'Вопросы - варианты ответов');
        
        // Проверка функций вопросов
        await this.testFunction('selectAnswer', 'Вопросы - выбор ответа');
        await this.testFunction('showQuestion', 'Вопросы - показ вопроса');
        await this.testFunction('updateProgress', 'Вопросы - обновление прогресса');
    }

    async testResults() {
        this.log("🔍 Тестирование системы результатов...");
        
        // Проверка элементов результатов
        await this.testElement('#finalResults', 'Результаты - финальные результаты');
        await this.testElement('.result-summary', 'Результаты - сводка результатов');
        
        // Проверка функций результатов
        await this.testFunction('calculateResults', 'Результаты - расчет результатов');
        await this.testFunction('showCompactBlockResult', 'Результаты - компактные блоки');
    }

    async testGlobalState() {
        this.log("🔍 Тестирование глобального состояния...");
        
        // Проверка глобальных переменных
        try {
            if (typeof currentState !== 'undefined') {
                this.log("✅ Глобальное состояние: currentState существует");
            } else {
                this.log("❌ Глобальное состояние: currentState не найден", true);
            }
        } catch (error) {
            this.log(`❌ Глобальное состояние: Ошибка проверки - ${error.message}`, true);
        }

        try {
            if (typeof questions !== 'undefined' && Array.isArray(questions)) {
                this.log(`✅ Данные: questions массив из ${questions.length} вопросов`);
            } else {
                this.log("❌ Данные: questions не найден или не массив", true);
            }
        } catch (error) {
            this.log(`❌ Данные: Ошибка проверки questions - ${error.message}`, true);
        }
    }

    async simulateUserFlow() {
        this.log("🔍 Симуляция пользовательского сценария...");
        
        try {
            // Проверяем начальное состояние
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen && loadingScreen.style.display !== 'none') {
                this.log("✅ Симуляция: Заставка отображается при загрузке");
            } else {
                this.log("❌ Симуляция: Заставка не отображается правильно", true);
            }

            // Попробуем симулировать клик на кнопку старта
            const startBtn = document.querySelector('.start-test-btn');
            if (startBtn) {
                this.log("✅ Симуляция: Кнопка старта доступна для клика");
                
                // Проверяем onclick обработчик
                if (startBtn.onclick) {
                    this.log("✅ Симуляция: У кнопки старта есть onclick обработчик");
                } else {
                    this.log("❌ Симуляция: У кнопки старта нет onclick обработчика", true);
                }
            } else {
                this.log("❌ Симуляция: Кнопка старта не найдена", true);
            }

        } catch (error) {
            this.log(`❌ Симуляция: Ошибка при симуляции - ${error.message}`, true);
        }
    }

    async runAllTests() {
        this.log("🚀 Запуск автоматического тестирования приложения...");
        
        await this.testStartupScreen();
        await this.sleep(500);
        
        await this.testNavigation();
        await this.sleep(500);
        
        await this.testQuestionSystem();
        await this.sleep(500);
        
        await this.testResults();
        await this.sleep(500);
        
        await this.testGlobalState();
        await this.sleep(500);
        
        await this.simulateUserFlow();
        
        this.generateReport();
    }

    generateReport() {
        this.log("📊 Генерация отчета о тестировании...");
        
        const total = this.passed + this.failed;
        const successRate = ((this.passed / total) * 100).toFixed(1);
        
        console.log("\n" + "=".repeat(60));
        console.log("📋 ОТЧЕТ О ТЕСТИРОВАНИИ ПРИЛОЖЕНИЯ");
        console.log("=".repeat(60));
        console.log(`📈 Общая статистика:`);
        console.log(`   ✅ Пройдено: ${this.passed}`);
        console.log(`   ❌ Провалено: ${this.failed}`);
        console.log(`   📊 Всего: ${total}`);
        console.log(`   🎯 Успешность: ${successRate}%`);
        console.log("=".repeat(60));
        
        if (this.failed > 0) {
            console.log("❌ ОБНАРУЖЕННЫЕ ПРОБЛЕМЫ:");
            this.results.filter(r => r.status === 'FAILED').forEach((result, index) => {
                console.log(`   ${index + 1}. ${result.message}`);
            });
            console.log("=".repeat(60));
        }
        
        // Рекомендации по исправлению
        console.log("💡 РЕКОМЕНДАЦИИ ПО ИСПРАВЛЕНИЮ:");
        if (this.failed > 0) {
            console.log("   1. Проверьте консоль браузера на JavaScript ошибки");
            console.log("   2. Убедитесь что все элементы HTML присутствуют");
            console.log("   3. Проверьте правильность селекторов в CSS");
            console.log("   4. Проверьте что все функции определены в window scope");
        } else {
            console.log("   🎉 Все тесты прошли успешно!");
        }
        console.log("=".repeat(60));
        
        return {
            passed: this.passed,
            failed: this.failed,
            total: total,
            successRate: successRate,
            results: this.results
        };
    }
}

// Автозапуск тестов при загрузке скрипта
window.runAutomaticTest = async function() {
    const tester = new TestRunner();
    return await tester.runAllTests();
};

console.log("🔧 Скрипт автоматического тестирования загружен!");
console.log("🚀 Для запуска тестов выполните: runAutomaticTest()");