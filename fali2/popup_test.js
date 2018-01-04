require([
    './js/Config.jenkins_job',
    './js/Jenkins',
    './js/Utils',
    './js/ClientAPI'
], function (Config, Jenkins, Utils, ClientAPI) {
    const logInBtn = Utils.qs('#btn');

    function getInputsValues(form) {
        let arrayValues = [];
        for (var i = 0; i < form.elements.length; i++) {
            var input = form[i];
            arrayValues.push(input.value);
        }
        return arrayValues;
    }

    function loadSpinner(element) {
        const spinner = document.createElement('img');
        spinner.alt = 'Loading...';
        spinner.src = 'img/spinner.gif';
        spinner.className = 'omj__loading-spinner';
        if (!Utils.isAlreadyCreated('.omj__loading-spinner')) {
            return element.insertAdjacentElement('afterend', spinner);
        }
    }

    logInBtn.addEventListener('click', function (ev) {
        ev.preventDefault();
        loadSpinner(logInBtn);
        const form = ev.target.parentNode;
        const value = getInputsValues(form);
        Config.username = 'sergio.mironescu@marfeel.com'; //value[0];
        Config.token = '0a64474008e850b439353d2929013e13'; //value[1];
        Config.host = 'bobthebuilder.marfeel.com'; //value[2];
        Config.port = '8443'; //value[3];

        const host = `https://${Config.username}:${Config.token}@${Config.host}:${Config.port}`;

        Jenkins.init(host, Config.username, Config.token, ClientAPI.build);

        fetch('https://bobthebuilder.marfeel.com:8443/view/2.Alice/api/json', {
            method: 'GET',
            headers: {
                "Authorization": 'Basic ' + btoa(`${options.user}:${options.token}`)
            },
            mode: 'cors'
        }).then(function (response) {
            if (response.status === 401) {
                return errorResponse(response);
            } else {
                Utils.clearNode(document, '.omj__loading-spinner');
                Utils.clearNode(document, '.omj__form-style');
                response.json().then(function (data) {
                    return callback ? callback(data, options) : data;
                });
            }
        });


    });

});



