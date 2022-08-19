(function () {
    const Result = {
        link: null,
        init() {
            const url = new URL(location.href);
            document.getElementById('result-score').innerText = url.searchParams.get('score')
                + '/' + url.searchParams.get('total');


            this.link = document.getElementById('link');
            this.link.onclick = function () {
                const id = url.searchParams.get('id');
                const tittle = url.searchParams.get('tittle');
                const name = url.searchParams.get('name');
                const lastName = url.searchParams.get('lastName');
                const email = url.searchParams.get('email');
                location.href = 'answers.html?id=' + id + '&tittle=' + tittle + '&name=' + name + '&lastName=' + lastName + '&email=' + email;
            }


        },

    }
    Result.init();
})();