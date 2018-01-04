define([
    './js/core/Jenkins',
    './js/core/Utils',
    './js/core/ConfigJSON'
], function (Jenkins, Utils, ConfigJSON) {
    Utils.log('POPUP');

    function showJenkinsJobs(data) {
        console.log('This is: ' + data)
    }

    function isLogged() {
        chrome.storage.local.get('userName', function (result) {
            const isAuth = !!result.userName;
            if (isAuth) {
                Utils.createIframe(ConfigJSON.htmlViews.user);
            } else {
                Utils.createIframe(ConfigJSON.htmlViews.login);
                Utils.clearStorage();
            }
        });
    }

    chrome.runtime.getBackgroundPage(function (backend) {
        backend.getData(function (data) {
            if (data) {
                showJenkinsJobs(data);
            }
        });
    });

    return isLogged()
});
