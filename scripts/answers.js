(function () {
    const Answers = {
        answers: [],
        myResult: [],
        quiz: [],
        init() {
            const url = new URL(location.href);
            const id = url.searchParams.get('id');
            this.tittle = url.searchParams.get('tittle');
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://testologia.site/get-quiz-right?id=' + id, false);
            xhr.send();

            if (xhr.status === 200 && xhr.responseText) {
                try {
                    this.answers = JSON.parse(xhr.responseText);
                    console.log(this.answers);
                    this.generatePage();
                } catch (e) {
                    location.href = 'result.html';
                }
            } else {
                location.href = 'result.html';
            }

        },
        //Функция генерации страницы с ответами тестов
        generatePage() {
            const url = new URL(location.href);
            const id = url.searchParams.get('id');
            this.tittle = url.searchParams.get('tittle');
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://testologia.site/get-quiz?id=' + id, false);
            xhr.send();

            if (xhr.status === 200 && xhr.responseText) {
                try {
                    this.quiz = JSON.parse(xhr.responseText);
                } catch (e) {
                    location.href = 'result.html';
                }
            } else {
                location.href = 'result.html';
            }

            const name = url.searchParams.get('name');
            const lastName = url.searchParams.get('lastName');
            const email = url.searchParams.get('email');

            let preTittle = document.getElementById('pre-tittle');
            preTittle.innerHTML = `Тест выполнил <span>${name} ${lastName}, ${email}</span>`

            document.getElementById('test-tittle').innerText = this.quiz.name;

            const answersItems = document.getElementById('answers-items');

            this.quiz.questions.forEach((item, index) => {

                const answers = document.createElement('div');
                answers.className = 'answer';
                const tittle = document.createElement('div');
                tittle.className = 'test-question-tittle';
                tittle.innerHTML = `<span>Вопрос ${index + 1}:</span> ${item.question}`;
                const items = document.createElement('div');
                items.className = 'items';

                answers.appendChild(tittle);
                answers.appendChild(items);
                answersItems.appendChild(answers);

                item.answers.forEach(answer => {
                    const answersItem = document.createElement('div');
                    answersItem.setAttribute('id', answer.id);
                    answersItem.className = 'answers-item';
                    const circle = document.createElement('div');
                    circle.className = 'answers-circle';
                    const text = document.createElement('div');
                    text.className = 'answers-text';
                    text.innerText = answer.answer;
                    answersItem.appendChild(circle);
                    answersItem.appendChild(text);
                    items.appendChild(answersItem);

                })

            })
            this.myResult = JSON.parse(sessionStorage.getItem('result'));
            this.showRightAnswer();
        },
        //Функция определения правильных ответов
        showRightAnswer() {

            this.myResult.forEach((myRes, index) => {

                if (myRes.chosenAnswerId === Answers.answers[index]) {
                    Array.from(document.getElementById(myRes.chosenAnswerId).children).forEach(item => {
                        if (item.className === 'answers-circle') {
                            item.classList.add('green-circle');
                        } else {
                            item.classList.add('green-text');
                        }
                    })
                } else {
                    Array.from(document.getElementById(myRes.chosenAnswerId).children).forEach(item => {
                        if (item.className === 'answers-circle') {
                            item.classList.add('red-circle');
                        } else {
                            item.classList.add('red-text');
                        }
                    })
                }
            })

        },
    }
    Answers.init();
})();