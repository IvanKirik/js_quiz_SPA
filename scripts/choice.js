(function () {
    const Choice = {
        quizzes: [],
        init() {
            checkUserData();
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://testologia.site/get-quizzes', false);
            xhr.send();

            if (xhr.status === 200 && xhr.responseText) {
                try {
                    this.quizzes = JSON.parse(xhr.responseText);
                } catch (e) {
                    location.href = 'index.html';
                }
                this.processQuizzes();
            } else {
                location.href = 'index.html';
            }
        },
        processQuizzes() {
            const choiceOptionsElement = document.getElementById('choice-options');
            if(this.quizzes && this.quizzes.length > 0) {
                this.quizzes.forEach(quiz => {
                    const that = this;
                    const choiceOptionElement = document.createElement('div');
                    choiceOptionElement.className = 'choice-option';
                    choiceOptionElement.setAttribute('data-id', quiz.id);
                    choiceOptionElement.onclick = function () {
                        that.choiceQuiz(this);
                    }

                    const choiceOptionText = document.createElement('div');
                    choiceOptionElement.innerText = quiz.name;

                    const choiceOptionArrow = document.createElement('div');
                    choiceOptionArrow.className = 'choice-option-arrow';

                    const choiceOptionImg = document.createElement('img');
                    choiceOptionImg.setAttribute('src', 'img/arrow.png');
                    choiceOptionImg.setAttribute('alt', 'Стрелка');

                    choiceOptionArrow.appendChild(choiceOptionImg);
                    choiceOptionElement.appendChild(choiceOptionText);
                    choiceOptionElement.appendChild(choiceOptionArrow);

                    choiceOptionsElement.appendChild(choiceOptionElement);
                });
            }

        },
        //Функция выбора конкретного теста
        choiceQuiz (element) {
            const dataId = element.getAttribute('data-id');
            if (dataId) {
                location.href = 'test.html' + location.search + '&id=' + dataId;
            }
        }
    }
    Choice.init();
})();