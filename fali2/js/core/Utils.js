const Utils = {
    qs(selector, node) {
        return (node || document).querySelector(selector);
    },
    qsAll: function qsAll(selector, node) {
        var nodeList = (node || document).querySelectorAll(selector);
        return this.toArray(nodeList);
    },
    isAlreadyCreated: function (selector, node) {
        return node || document.querySelector(selector);
    },
    toArray: function (node) {
        return Array.prototype.slice.call(node);
    },
    clearNode: function (element, selector) {
        var nodes = this.qsAll(selector) || element;
        [].forEach.call(nodes, function (node) {
            return node && node.remove();
        });
    },
    getInputsValues: function (form) {
        let arrayValues = [];
        for (var i = 0; i < form.elements.length; i++) {
            var input = form[i];
            arrayValues.push(input.value);
        }
        return arrayValues;
    },
    closePopUp: function () {
        chrome.extension.getViews({type: "popup"}).forEach(function(win) {
            if(win != window) win.close();
        });
    },
    createIframe: function (view) {
        document.body.innerHTML = '';
        const iframe = document.createElement('iframe');
        iframe.src = view;
        document.body.appendChild(iframe);
    },
    clearStorage: function () {
        return chrome.storage.local.clear();
    },
    log: function (msg) {
        console.log('======= ' + msg + ' =======');
    }
};

module.exports = Utils;


