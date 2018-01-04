import Utils from "./js/core/Utils";
import Jenkins from "./js/core/Jenkins";

(function () {
    "use strict";
    Jenkins.init();

    var Jobs = Jenkins.Jobs;
    var $rootScope = Utils.scope;

    var urlsTextarea = document.querySelector('#urls');

    $rootScope.$on('Jobs::jobs.initialized', function (event, jobs) {
        showJobUrls(jobs);
    });

    NodeList.prototype.forEach = Array.prototype.forEach;

    var refreshTimeInput = document.getElementById('refreshTime');
    var refreshTimeSpan = document.getElementById('refreshTimeSpan');
    var optionsStatusElement = document.getElementById('optionStatus');
    var urlsStatusElement = document.getElementById('urlsStatus');

    var defaultOptions = {
        refreshTime: 60,
        notification: 'all'
    };

    function showSavedNotification(statusElement) {
        // Update status to let user know options were saved.
        statusElement.style.visibility = "";
        setTimeout(function () {
            statusElement.style.visibility = "hidden";
        }, 2000);
    };

    function showJobUrls(jobs) {
        urlsTextarea.value = Object.keys(jobs).join("\n");
    }

    // Saves options to chrome.storage.local.
    function saveOptions() {
        var options = {
            refreshTime: refreshTimeInput.value,
            notification: document.querySelector('[name=notification]:checked').value
        };
        chrome.storage.local.set({options: options}, function () {
            showSavedNotification(optionsStatusElement);
        });
    }

    // Saves urls to chrome.storage.local.
    function saveUrls() {
        var value = urlsTextarea.value.trim();
        var newUrls = value ? value.replace(/[\r\n]+/g, "\n").split("\n") : [];
        Jobs.setUrls(newUrls).then(showJobUrls).then(function () {
            showSavedNotification(urlsStatusElement);
        });
    }

    // Restores the preferences stored in chrome.storage.
    function restoreOptions() {
        // TODO create and use OptionService
        chrome.storage.local.get({options: defaultOptions}, function (objects) {
            var options = objects.options;
            document.querySelector('[name=notification]:checked').checked = false;
            document.querySelector('[name=notification][value="' + options.notification + '"]').checked = true;
            refreshTimeSpan.textContent = refreshTimeInput.value = options.refreshTime;
        });
    }

    function updateRefreshTimeSpan() {
        refreshTimeSpan.textContent = refreshTimeInput.value;
    }

    document.addEventListener('DOMContentLoaded', restoreOptions);
    document.querySelectorAll('input').forEach(function (element) {
        element.addEventListener('change', saveOptions);
    });
    document.querySelector('#saveUrls').addEventListener('click', saveUrls);
    refreshTimeInput.addEventListener('input', updateRefreshTimeSpan);
})();

/*const ERROR_MSG = 'You did not select any views!';
const SUCCESS_MSG = 'View(s) saved!!';
const btnOptions = Utils.qs('#btnOptions');
const errorNode = Utils.qs('.error');

function getInputsValues(form) {
    let arrayValues = [];
    for (var i = 0; i < form.elements.length; i++) {
        var input = form[i];
        if (input.checked) {
            arrayValues.push(input.value);
        }
    }
    return arrayValues;
}

function successMsg(form) {
    const aElement = document.createElement('a');
    aElement.href = Utils.closePopUp(); //chrome.extension.getURL('popup.html');
    aElement.innerText = SUCCESS_MSG;
    aElement.className = 'omj_successBtn';
    Utils.clearNode(btnOptions);
    if (!Utils.isAlreadyCreated('.omj_successBtn')) {
        return form.appendChild(aElement);
    }
}

function saveUserSelectedViews(inputs, form) {
    chrome.storage.sync.set({'saved_views': inputs}, function () {
        Utils.log('saved views: ', inputs);
        if (inputs.length > 0) {
            successMsg(form);
            Utils.clearNode(errorNode);
        } else {
            Utils.error(ERROR_MSG);
        }
    });
}

function buildAllViews(response) {
    response.views[0].url = 'https://bobthebuilder.marfeel.com:8443/view/0.Core/';
    for (let i = 0; i < response.views.length; i++) {
        const view = response.views[i];
        const input = document.createElement('input');
        const viewTitle = document.createElement('label');
        viewTitle.innerText = view.name;
        input.setAttribute('type', 'checkbox');
        input.setAttribute('value', view.url);
        input.setAttribute('name', 'jenkins_view');
        Utils.insertElement(btnOptions, 'beforebegin', input);
        Utils.insertElement(input, 'afterend', viewTitle);
    }
}

chrome.runtime.sendMessage({fn: 'getViews'}, function (response) {
    Utils.log('From background (getViews) ', response);
    if (!!response && !!response.views) {
        buildAllViews(response);
    }

    btnOptions && btnOptions.addEventListener('click', function (ev) {
        ev.preventDefault();
        const form = Utils.qs('.omj__form-style form');
        const inputs = getInputsValues(form);
        saveUserSelectedViews(inputs, form)
    })
});*/
