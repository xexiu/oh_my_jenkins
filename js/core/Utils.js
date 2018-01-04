module.exports = {
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
            if (win != window) win.close();
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
            console.log('Utils.removeClass: ', element + 'already removed this class: ', selector);
        }
    },
    addClass: function (element, selector) {
        if (element && element.classList.contains(selector)) {
            console.log('Utils.addClass: ', element + 'already has this class: ', selector);
        } else {
            element.classList.add(selector);
        }
    },
    insertElement: function (node, position, element) {
        return node.insertAdjacentElement(position, element);
    },
    error: function (text) {
        const error = Utils.qs('.error');
        error.innerText = text;
    },
    req: {
        defer: function () {
            var defer = {};
            defer.promise = new Promise(function (resolve, reject) {
                defer.resolve = resolve;
                defer.reject = reject;
            });
            return defer;
        },
        when: function (value) {
            return Promise.resolve(value);
        },
        all: function (iterable) {
            return Promise.all(iterable);
        }
    },
    scope: {
        broadcast: function (name, detail) {
            window.dispatchEvent(new CustomEvent(name, {detail: detail}));
        },
        on: function (name, callback) {
            window.addEventListener(name, function (e) {
                callback(e, e.detail);
            });
        }
    },
    StorageService: function (req) {
        var storage = chrome.storage.local;

        function promisedCallback(deferred) {
            return function (data) {
                if (chrome.runtime.lastError) {
                    deferred.reject(runtime.lastError);
                } else {
                    deferred.resolve(data);
                }
            };
        }

        return {
            onChanged: chrome.storage.onChanged,
            get: function (keys) {
                var deferred = req.defer();
                storage.get(keys, promisedCallback(deferred));
                return deferred.promise;
            },
            set: function (objects) {
                var deferred = req.defer();
                storage.set(objects, promisedCallback(deferred));
                return deferred.promise;
            }
        };
    },
    $forEach: {
        forEach: function (obj, iterator) {
            if (obj) {
                if (obj.forEach) {
                    obj.forEach(iterator);
                } else if ('length' in obj && obj.length > 0) {
                    for (let i = 0; i < obj.length; i++) {
                        iterator(obj[i], i);
                    }
                } else {
                    for (let key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            iterator(obj[key], key);
                        }
                    }
                }
            }
            return obj;
        },
        clone: function (obj) {
            return JSON.parse(JSON.stringify(obj));
        }
    }
};
