/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    qs: function qs(selector, node) {
        return (node || document).querySelector(selector);
    },

    qsAll: function qsAll(selector, node) {
        var nodeList = (node || document).querySelectorAll(selector);
        return this.toArray(nodeList);
    },
    isAlreadyCreated: function isAlreadyCreated(selector, node) {
        return node || document.querySelector(selector);
    },
    toArray: function toArray(node) {
        return Array.prototype.slice.call(node);
    },
    clearNode: function clearNode(element, selector) {
        var nodes = this.qsAll(selector) || element;
        if (nodes.length > 0) {
            [].forEach.call(nodes, function (node) {
                return node && node.remove();
            });
        } else {
            if (element && !element instanceof HTMLDocument) {
                return element && element.remove();
            }
        }
    },
    getInputsValues: function getInputsValues(form) {
        var arrayValues = [];
        for (var i = 0; i < form.elements.length; i++) {
            var input = form[i];
            arrayValues.push(input.value);
        }
        return arrayValues;
    },
    closePopUp: function closePopUp() {
        chrome.extension.getViews({ type: "popup" }).forEach(function (win) {
            if (win != window) win.close();
        });
    },
    createIframe: function createIframe(src) {
        document.body.innerHTML = '';
        var iframe = document.createElement('iframe');
        iframe.src = src;
        document.body.appendChild(iframe);
    },
    clearStorage: function clearStorage() {
        return chrome.storage.local.clear();
    },
    log: function log(msg, callBack) {
        console.log('======>>> ' + msg);
        console.log(callBack);
    },
    removeClass: function removeClass(element, selector) {
        if (element && element.classList.contains(selector)) {
            element.classList.remove(selector);
        } else {
            console.log('Utils.removeClass: ', element + 'already removed this class: ', selector);
        }
    },
    addClass: function addClass(element, selector) {
        if (element && element.classList.contains(selector)) {
            console.log('Utils.addClass: ', element + 'already has this class: ', selector);
        } else {
            element.classList.add(selector);
        }
    },
    insertElement: function insertElement(node, position, element) {
        return node.insertAdjacentElement(position, element);
    },
    error: function error(text) {
        var error = Utils.qs('.error');
        error.innerText = text;
    },
    req: {
        defer: function defer() {
            var defer = {};
            defer.promise = new Promise(function (resolve, reject) {
                defer.resolve = resolve;
                defer.reject = reject;
            });
            return defer;
        },
        when: function when(value) {
            return Promise.resolve(value);
        },
        all: function all(iterable) {
            return Promise.all(iterable);
        }
    },
    scope: {
        broadcast: function broadcast(name, detail) {
            window.dispatchEvent(new CustomEvent(name, { detail: detail }));
        },
        on: function on(name, callback) {
            window.addEventListener(name, function (e) {
                callback(e, e.detail);
            });
        }
    },
    StorageService: function StorageService(req) {
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
            get: function get(keys) {
                var deferred = req.defer();
                storage.get(keys, promisedCallback(deferred));
                return deferred.promise;
            },
            set: function set(objects) {
                var deferred = req.defer();
                storage.set(objects, promisedCallback(deferred));
                return deferred.promise;
            }
        };
    },
    $forEach: {
        forEach: function forEach(obj, iterator) {
            if (obj) {
                if (obj.forEach) {
                    obj.forEach(iterator);
                } else if ('length' in obj && obj.length > 0) {
                    for (var i = 0; i < obj.length; i++) {
                        iterator(obj[i], i);
                    }
                } else {
                    for (var key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            iterator(obj[key], key);
                        }
                    }
                }
            }
            return obj;
        },
        clone: function clone(obj) {
            return JSON.parse(JSON.stringify(obj));
        }
    }
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var configJSON = {
    API_JSON: '/api/json',
    HTTPS: 'https://',
    HTTP_CODE_401: 401,
    SLASH: '/',
    DOUBLE_SLASH: '//',
    fetch: {
        credentials: 'include'
    },
    SERVER_DOWN: 'Must be a timeout! Server is down? ErrorCode: ',
    jobs: {
        JOBS_INITIALIZED: 'Jobs::jobs.initialized',
        JOBS_CHANGED: 'Jobs::jobs.changed'
    },
    all: 'all',
    OPTIONS_CHANGED: 'Options::options.changed',
    Unreachable: 'Unreachable',
    status: {
        SUCCESS: 'green',
        UNSTABLE: 'orange',
        FAILURE: 'red',
        ABORTED: 'grey'
    },
    template: {
        default: '',
        upstream: ''
    },
    ZERO: 0,
    ONE: 1
};

module.exports = configJSON;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Utils = __webpack_require__(0);

var Utils = _interopRequireWildcard(_Utils);

var _ConfigJSON = __webpack_require__(1);

var _ = _interopRequireWildcard(_ConfigJSON);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var API = 'api';
var scope = Utils.scope;
var req = Utils.req;
var $ = Utils.$forEach;
var Storage = Utils.StorageService(req);
var defaultJobData = defaultJobDataService();
var jenkins = jenkinsService(defaultJobData);
var Jobs = JobsService(req, Storage, jenkins, defaultJobData);

function jenkinsService(defaultJobData) {
    var buildingRegExp = /_anime$/;
    var colorToClass = {
        blue: 'success', yellow: 'warning', red: 'danger'
    };
    var colorToIcon = {
        blue: 'green', yellow: 'yellow', red: 'red'
    };
    var status = {
        blue: 'Success',
        yellow: 'Unstable',
        red: 'Failure',
        aborted: 'Aborted',
        notbuilt: 'Not built',
        disabled: 'Disabled'
    };

    function jobMapping(url, data) {
        var basicColor = (data.color || '').replace(buildingRegExp, '');
        var lastBuild = data.lastCompletedBuild || {};
        return {
            name: data.displayName || data.name || data.nodeName || 'All jobs',
            url: decodeURI(data.url || url),
            building: buildingRegExp.test(data.color),
            status: status[basicColor] || basicColor,
            statusClass: colorToClass[basicColor] || '',
            statusIcon: colorToIcon[basicColor] || 'grey',
            lastBuildNumber: lastBuild.number || '',
            lastBuildTime: '',
            jobs: data.jobs && data.jobs.reduce(function (jobs, data) {
                var job = jobMapping(null, data);
                jobs[subJobKey(job.url)] = job;
                return jobs;
            }, {})
        };
    }

    function subJobKey(url) {
        return url.replace(/^.+?\/job\/(.+)\/$/, "$1").replace(/\/job\//g, "/");
    }

    return function (url) {
        url = url.charAt(url.length - 1) === '/' ? url : url + '/';

        return Jenkins.request(url).then(function (res) {
            return res.ok ? res.json() : Promise.reject(res);
        }).then(function (data) {
            var job = jobMapping(url, data);
            return job;
        });
    };
}

function defaultJobDataService() {
    return function (url, status) {
        var jobNameRegExp = /.*\/job\/([^/]+)(\/.*|$)/;
        return {
            name: decodeURI(url.replace(jobNameRegExp, '$1')),
            url: decodeURI(url),
            building: false,
            status: status || '',
            statusClass: undefined,
            statusIcon: undefined,
            lastBuildNumber: undefined,
            error: undefined,
            jobs: undefined
        };
    };
}

function JobsService(req, Storage, jenkins, defaultJobData) {
    var Jobs = {
        jobs: {},
        add: function add(url, data) {
            var result = {};
            result.oldValue = Jobs.jobs[url];
            result.newValue = Jobs.jobs[url] = data || Jobs.jobs[url] || defaultJobData(url);
            return Storage.set({ jobs: Jobs.jobs }).then(function () {
                return result;
            });
        },
        remove: function remove(url) {
            delete Jobs.jobs[url];
            return Storage.set({ jobs: Jobs.jobs });
        },
        setUrls: function setUrls(urls) {
            var newJobs = {};
            urls.forEach(function (url) {
                newJobs[url] = Jobs.jobs[url] || defaultJobData(url);
            });
            Jobs.jobs = newJobs;

            return Storage.set({ jobs: Jobs.jobs }).then(function () {
                return Jobs.jobs;
            });
        },
        updateStatus: function updateStatus(url) {
            return jenkins(url).catch(function (res) {
                // On error, keep existing data or create default one
                var data = $.clone(Jobs.jobs[url]) || defaultJobData(url);
                data.error = (res instanceof Error ? res.message : res.statusText) || _.Unreachable;
                return data;
            }).then(function (data) {
                return Jobs.add(url, data);
            });
        },
        updateAllStatus: function updateAllStatus() {
            var promises = [];
            $.forEach(Jobs.jobs, function (_, url) {
                promises.push(Jobs.updateStatus(url));
            });
            return req.when(promises);
        }
    };

    return Jobs;
}

// Initialize options and listen for changes
function initOptions(scope, Storage) {
    scope.options = {
        refreshTime: 60,
        notification: _.all
    };

    Storage.get({ options: scope.options }).then(function (objects) {
        scope.options = objects.options;
        scope.broadcast(_.OPTIONS_CHANGED, scope.options);
    });

    Storage.onChanged.addListener(function (objects) {
        if (objects.options) {
            scope.options = objects.options.newValue;
            scope.broadcast(_.OPTIONS_CHANGED, scope.options);
        }
    });
}

// Initialize jobs and listen for changes
function initJobs(Jobs, Storage, scope) {
    Jobs.jobs = {};

    Storage.get({ jobs: Jobs.jobs }).then(function (objects) {
        Jobs.jobs = objects.jobs;
        scope.broadcast(_.jobs.JOBS_INITIALIZED, Jobs.jobs);
        scope.broadcast(_.jobs.JOBS_CHANGED, Jobs.jobs);
    });

    Storage.onChanged.addListener(function (objects) {
        if (objects.jobs) {
            Jobs.jobs = objects.jobs.newValue;
            scope.broadcast(_.jobs.JOBS_CHANGED, Jobs.jobs);
        }
    });
}

function errorResponse(response) {
    var error = Utils.qs('.error');
    Utils.clearNode(document, '.omj__loading-spinner');
    return error.innerText = response.statusText || response;
}

function cleanUrl(url) {
    if (url && url.includes("" + _.DOUBLE_SLASH + API)) {
        return url.replace("" + _.DOUBLE_SLASH + API, "" + _.SLASH + API);
    }
    return url;
}

var Jenkins = {
    init: function init() {
        initOptions(scope, Storage);
        initJobs(Jobs, Storage, scope);
    },
    Jobs: Jobs,
    getJobs: function getJobs(url, callback) {
        this.request(url, callback);
    },
    getJobsInfo: function getJobsInfo(url, callback) {
        this.request(url, callback);
    },
    getBuild: function getBuild(url, callback) {
        this.request(url, callback);
    },
    request: function request(url, callback) {
        url = cleanUrl("" + url + _.API_JSON);
        fetch(url, _.fetch).then(function (response) {
            if (response.status === _.HTTP_CODE_401) {
                return errorResponse(response);
            } else {
                Utils.clearNode(document, '.omj__loading-spinner');
                Utils.clearNode(document, '.omj__form-style');
                response.json().then(function (data) {
                    return callback ? callback(data) : data;
                });
            }
        }).catch(function (error) {
            errorResponse(error);
            Utils.log("" + _.SERVER_DOWN + error);
        });
    }
};

module.exports = Jenkins;

/***/ }),
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Utils = __webpack_require__(0);

var _Utils2 = _interopRequireDefault(_Utils);

var _Jenkins = __webpack_require__(2);

var _Jenkins2 = _interopRequireDefault(_Jenkins);

var _ConfigJSON = __webpack_require__(1);

var _ConfigJSON2 = _interopRequireDefault(_ConfigJSON);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
    _Jenkins2.default.init();
    var $scope = _Jenkins2.default.$scope;
    var Jobs = _Jenkins2.default.Jobs;
    var $q = _Jenkins2.default.$q;
    var _ = _Jenkins2.default._;

    $rootScope.$on(_ConfigJSON2.default.jobs.JOBS_INITIALIZED, function () {
        Jobs.updateAllStatus().then($q.all).then(Services.buildWatcher);
    });

    $rootScope.$on(_ConfigJSON2.default.jobs.JOBS_CHANGED, function (event, jobs) {
        var counts = {};
        _.forEach(jobs, function (data) {
            if (data.jobs) {
                _.forEach(data.jobs, function (viewJob) {
                    counts[viewJob.status] = (counts[viewJob.status] || _ConfigJSON2.default.ZERO) + _ConfigJSON2.default.ONE;
                });
            } else {
                counts[data.status] = (counts[data.status] || _ConfigJSON2.default.ZERO) + _ConfigJSON2.default.ONE;
            }
        });

        var count = counts.Failure || counts.Unstable || counts.Success || _ConfigJSON2.default.ZERO;
        var color = counts.Failure ? '#c9302c' : counts.Unstable ? '#f0ad4e' : '#5cb85c';
        chrome.browserAction.setBadgeText({ text: count.toString() });
        chrome.browserAction.setBadgeBackgroundColor({ color: color });
    });

    var data = {};

    var background = {
        getViews: function getViews(request, sender, sendResponse) {
            chrome.storage.sync.get(['views'], function (items) {
                if (!!items && !!items.views) {
                    data.views = items.views;
                }
            });
            _Utils2.default.log('Background getViews: ', sendResponse(data));
        },
        savedViews: function savedViews(request, sender, sendResponse) {
            chrome.storage.sync.get(['saved_views'], function (items) {
                if (!!items && !!items.saved_views) {
                    data.saved_views = items.saved_views;
                }
            });
            _Utils2.default.log('Background savedViews: ', sendResponse(data));
        },
        init: function init() {
            chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
                if (request.fn in background) {
                    background[request.fn](request, sender, sendResponse);
                }
            });
        }
    };
})();

/***/ })
/******/ ]);
//# sourceMappingURL=background.bundle.js.map