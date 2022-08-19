(function () {
    const Test = {
        quiz: null,
        currentQuestionIndex: 1, //индекс текущего вопроса
        questionTitleElement: null, //заголовок текущего вопроса
        optionsElement: null, //вариант ответа
        nextButtonElement: null,
        prevButtonElement: null,
        passElement: null,
        progressBarElement: null,
        userResult: [], //результаты выполнения теста
        preTittle: null,
        init() {
            checkUserData();
            const url = new URL(location.href);
            const testId = url.searchParams.get('id');
            if (testId) {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://testologia.site/get-quiz?id=' + testId, false);
                xhr.send();
                if (xhr.status === 200 && xhr.responseText) {
                    try {
                        this.quiz = JSON.parse(xhr.responseText);
                    } catch (e) {
                        location.href = 'index.html';
                    }
                    this.startQuiz();
                } else {
                    location.href = 'index.html';
                }
            } else {
                location.href = 'index.html';
            }
        },
        //функция работы с тестами
        startQuiz() {
            this.progressBarElement = document.getElementById('progressbar');
            this.questionTitleElement = document.getElementById('test-question-tittle');
            this.optionsElement = document.getElementById('options');
            this.nextButtonElement = document.getElementById('next');
            this.nextButtonElement.onclick = this.move.bind(this, 'next');
            this.prevButtonElement = document.getElementById('prev');
            this.prevButtonElement.onclick = this.move.bind(this, 'prev');
            this.passElement = document.getElementById('pass');
            this.passElement.onclick = this.move.bind(this, 'pass');
            this.preTittle = document.getElementById('test-pre-title').innerText = this.quiz.name;


            this.prepareProgressBar();
            this.showQuestion();

            //реализация секундомера
            const timerElement = document.getElementById('timer');
            let seconds = 59;
            const interval = setInterval(function () {
                seconds--;
                timerElement.innerText = seconds;
                if(seconds === 0) {
                    clearInterval(interval);
                    this.complete();
                }
            }.bind(this), 1000);
        },
        prepareProgressBar() {
            for (let i = 0; i < this.quiz.questions.length; i++) {
                const itemElement = document.createElement('div');
                itemElement.className = 'test-progress-bar-item ' + (i === 0 ? 'active' : '');
                const itemCircle = document.createElement('div');
                itemCircle.className = 'test-progress-bar-item-circle';
                const itemElementText = document.createElement('div');
                itemElementText.className = 'test-progress-bar-item-text';
                itemElementText.innerText = 'Вопрос ' + (i+1);

                itemElement.appendChild(itemCircle);
                itemElement.appendChild(itemElementText);
                this.progressBarElement.appendChild(itemElement);


            }
        },
        //функция отображения текущего вопроса
        showQuestion() {
            const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1];
            this.questionTitleElement.innerHTML = `<span>Вопрос ${this.currentQuestionIndex}:</span> ${activeQuestion.question}`;

            this.optionsElement.innerHTML = '';
            const that = this;

            const chosenOption = this.userResult.find(item => item.questionId === activeQuestion.id);

            activeQuestion.answers.forEach(answer => {

                const optionElement = document.createElement('div');
                optionElement.className = 'test-question-option';

                const inputId = `answer${answer.id}`;

                const inputElement = document.createElement('input');
                inputElement.className = 'option-answer';
                inputElement.setAttribute('id', inputId);
                inputElement.setAttribute('type', 'radio');
                inputElement.setAttribute('name', 'answer');
                inputElement.setAttribute('value', answer.id);

                if(chosenOption && chosenOption.chosenAnswerId === answer.id) {
                    inputElement.setAttribute('checked', 'checked');
                }


                inputElement.onchange = function () {
                    that.chooseAnswer();
                }

                const labelElement = document.createElement('label');
                labelElement.setAttribute('for', inputId);
                labelElement.innerText = answer.answer;

                optionElement.appendChild(inputElement);
                optionElement.appendChild(labelElement);

                this.optionsElement.appendChild(optionElement);
            });

            if (chosenOption && chosenOption.chosenAnswerId) {
                this.nextButtonElement.removeAttribute('disabled');
            } else {
                this.nextButtonElement.setAttribute('disabled', 'disabled');
            }

            if (this.currentQuestionIndex === this.quiz.questions.length) {
                this.nextButtonElement.innerText = 'Завершить';
            } else {
                this.nextButtonElement.innerText = 'Далее';
            }

            if (this.currentQuestionIndex > 1) {
                this.prevButtonElement.removeAttribute('disabled')
            } else {
                this.prevButtonElement.setAttribute('disabled', 'disabled')
            }
        },
        //убираем свойство disabled у кнопки next после выбора варианта ответа
        chooseAnswer() {
            this.nextButtonElement.removeAttribute('disabled');
        },
        //перемещение по тесту кнопками prev и next
        move(action) {
            const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1];
            //находим коллекцию по имени класса и делаем из неё массив
            const chosenAnswer = Array.from(document.getElementsByClassName('option-answer')).find(element => {
                return element.checked;
            });

            let chosenAnswerId = null;
            if(chosenAnswer && chosenAnswer.value) {
                chosenAnswerId = Number(chosenAnswer.value);
            }

            const existingResult = this.userResult.find(item => {
                return item.questionId === activeQuestion.id;
            });
            if(existingResult) {
                existingResult.chosenAnswerId = chosenAnswerId;
            } else {
                this.userResult.push({
                    questionId: activeQuestion.id,
                    chosenAnswerId: chosenAnswerId,
                })
            }

            if (action === 'next' || action === 'pass') {
                this.currentQuestionIndex++;
            } else {
                this.currentQuestionIndex--;
            }

            if(this.currentQuestionIndex > this.quiz.questions.length) {
                this.complete();
                return;
            }

            Array.from(this.progressBarElement.children).forEach((item, index) => {
                const currentItemIndex = index + 1;
                item.classList.remove('complete');
                item.classList.remove('active');

                if(currentItemIndex === this.currentQuestionIndex) {
                    item.classList.add('active');
                } else if (currentItemIndex < this.currentQuestionIndex) {
                    item.classList.add('complete');
                }
            })

            //после изменения индекса вопроса, необходимо отобразить сам вопрос
            this.showQuestion();
        },
        //Функция завершения теста
        complete() {
            const url = new URL(location.href);
            const testId = url.searchParams.get('id');
            const name = url.searchParams.get('name');
            const lastName = url.searchParams.get('lastName');
            const email = url.searchParams.get('email');
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://testologia.site/pass-quiz?id=' + testId, false);
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            xhr.send(JSON.stringify({
                name: name,
                lastName: lastName,
                email: email,
                results: this.userResult,
            }));


            if (xhr.status === 200 && xhr.responseText) {
                let result = null;
                try {
                    result = JSON.parse(xhr.responseText);
                    let resultSession = JSON.stringify(this.userResult);
                    sessionStorage.clear();
                    sessionStorage.setItem('result', resultSession);
                } catch (e) {
                    location.href = 'index.html';
                }
                if (result) {
                    console.log(result);
                    location.href = 'result.html?score=' + result.score + '&total=' + result.total + '&id=' + testId + '&tittle=' + this.preTittle +
                    '&name=' + name + '&lastName=' + lastName + '&email=' + email;
                }
            } else {
                location.href = 'index.html';
            }
        }

    }

    Test.init();
})();