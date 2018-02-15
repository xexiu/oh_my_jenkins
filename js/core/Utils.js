module.exports = {
    buildTemplate: (selector, containerSelector) => {
        const templateImport = document.querySelector(selector).import;
        const template = templateImport.documentElement.querySelector('template');
        const cloneTemplate = document.importNode(template.content, true);
        document.querySelector(containerSelector).appendChild(cloneTemplate);
    },
    addclass: (elm, newclass) => {
        const classes = elm.className.split(' ');
        classes.push(newclass);
        if (elm.className === newClass) {
            throw Error(`class name: ${newclass} has already been defined!`);
        } else {
            elm.className = classes.join(' ');
        }
    },
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
        if (nodes.length > 0) {
            [].forEach.call(nodes, function (node) {
                return node && node.remove();
            });
        } else {
            if (element && (!element instanceof HTMLDocument)) {
                return element && element.remove();
            }
        }

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
        chrome.extension.getViews({type: "popup"}).forEach(function (win) {
            if (win !== window) win.close();
        });
    },
    createIframe: function (src) {
        document.body.innerHTML = '';
        const iframe = document.createElement('iframe');
        iframe.src = src;
        document.body.appendChild(iframe);
    },
    clearStorage: function () {
        return chrome.storage.local.clear();
    },
    log: function (msg, callBack) {
        console.log('======>>> ' + msg);
        console.log(callBack);
    },
    removeClass: function (element, selector) {
        if (element && element.classList.contains(selector)) {
            element.classList.remove(selector);
        } else {
            throw Error(`removeClass: ${element} already removed this class: ${selector}`);
        }
    },
    insertElement: function (node, position, element) {
        return node.insertAdjacentElement(position, element);
    },
    error: function (msg) {
        const error = Utils.qs('.error');
        error.innerText = msg;
    }
};
