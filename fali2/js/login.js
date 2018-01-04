define([
    '../js/core/Utils',
    '../js/core/Jenkins',
    '../js/core/ConfigJSON'
], function (Utils, Jenkins, ConfigJSON) {
    Utils.log('LOGIN');
    let Config = {};
    const logInBtn = Utils.qs('#btn');

    function loadSpinner(element) {
        const spinner = document.createElement('img');
        spinner.alt = 'Loading...';
        spinner.src = '../img/spinner.gif';
        spinner.className = 'omj__loading-spinner';
        if (!Utils.isAlreadyCreated('.omj__loading-spinner')) {
            return element.insertAdjacentElement('afterend', spinner);
        }
    }

    function setLocalStorageCredentials(data, options) {
        chrome.storage.local.set({'userEmail': options.user});
        chrome.storage.local.set({'userName': data.fullName});
        Utils.createIframe('../views/options.html');
        //welcomeBackMsgNotification(data.fullName)
    }

/*    function loadOptionsHtml() {
        const iframe = document.createElement('iframe');
        iframe.src = chrome.extension.getURL("views/options.html");
        document.body.insertBefore(iframe, document.body.firstChild);
        Utils.clearNode(document, 'header, main');
    }*/

    function welcomeBackMsgNotification(name) {
        chrome.notifications.create('welcome', {
            type: 'basic',
            iconUrl: '../img/icon-128.png',
            title: 'Welcome Back ' + name + '!',
            message: 'Remember to check the Settings :)',
            requireInteraction: true
        }, function (notificationId) {
            console.log('Notification id: ' + notificationId);
        });
        Utils.closePopUp();
    }
    logInBtn && logInBtn.addEventListener('click', function (ev) {
        ev.preventDefault();
        loadSpinner(logInBtn);

        const form = ev.target.parentNode;
        const value = Utils.getInputsValues(form);
        Config.user = 'sergio.mironescu@marfeel.com'; //value[0];
        Config.token = '0a64474008e850b439353d2929013e13'; //value[1];
        Config.host = 'bobthebuilder.marfeel.com'; //value[2];
        Config.port = '8443'; //value[3];

        const host = `https://${Config.user}:${Config.token}@${Config.host}:${Config.port}`;

        Jenkins.init(host, Config.user, Config.token, setLocalStorageCredentials);
    });

    /*function isLogged(callback) {
        chrome.storage.local.get('user', function (result) {
            if(!!result.user){
                callback && callback();
            } else {
                chrome.storage.local.clear()
            }
        });
    }*/
});
