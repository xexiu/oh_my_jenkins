define([
    '../js/core/Jenkins',
    '../js/core/Utils'
],function (Jenkins, Utils) {
    'use strict';
    Utils.log('USER');

    const settingsBtn = Utils.qs('.omj-settings__img--settings');

    function setUserName(username) {
        const header = Utils.qs('.omj-header__title--user');
        header.innerText = username;
    }

    chrome.runtime.getBackgroundPage(function (backend) {
        backend.getUsername(function (data) {
            if (data) {
                setUserName(data);
            }
        });
    });

    settingsBtn && settingsBtn.addEventListener('click', function (ev) {
        ev.preventDefault();
        Utils.createIframe('../views/options.html');
    });


    /*setTimeout(function () {
        setUserName();
    }, 5000);*/
});
