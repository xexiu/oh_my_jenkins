require([
    '../js/core/Utils'
],
    function (Utils) {
    Utils.log('BACKGROUND');
//console.log("Hello from background.js");
    let listeners = {};
    var jenkinsData = 'jenkins_data';

//======= notifications =====//

    chrome.alarms.onAlarm.addListener(function (alarm) {
        chrome.storage.local.get(jenkinsData, showNotification);
    });

    function showNotification(storedData) {
        // Now create the notification
        chrome.notifications.create('reminder', {
            type: 'basic',
            iconUrl: 'img/icon-128.png',
            title: 'Don\'t forget!',
            message: 'You have things to do. Wake up, dude!',
            requireInteraction: true
        }, function (notificationId) {
            console.log(notificationId)
        });

        //chrome.notifications.clear(string notificationId, function callback) <--- clear specific NotificationId
        //chrome.notifications.getAll(function callback) <--- clear all notifications
        // API <--- https://developer.chrome.com/apps/notifications
    }


//======= public API =======//

    window.on = function (event, callback) {

        listeners[event] = callback;
        console.log('register listener', event, listeners[event]);
    };

//compatibility api
        window.getUsername = function (callback) {
            chrome.storage.local.get('userName', function (items) {
                if (items['userName']) {
                    callback(items['userName']);
                    //showNotification(items);
                } else {
                    //requestData();
                    callback(null);
                }
            });
        };

    window.getData = function (callback) {
        chrome.storage.local.get('jenkins_data', function (items) {
            if (items['jenkins_data']) {
                callback(items['jenkins_data']);
                showNotification(items);
            } else {
                //requestData();
                callback(null);
            }
        });
    };

});
