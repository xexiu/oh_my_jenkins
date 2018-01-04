import * as Utils from "./Utils";
import * as _ from "./ConfigJSON";

const API = 'api';
const scope = Utils.scope;
const req = Utils.req;
const $ = Utils.$forEach;
const Storage = Utils.StorageService(req);
const defaultJobData = defaultJobDataService();
const jenkins = jenkinsService(defaultJobData);
const Jobs = JobsService(req, Storage, jenkins, defaultJobData);

function jenkinsService(defaultJobData) {
    const buildingRegExp = /_anime$/;
    const colorToClass = {
        blue: 'success', yellow: 'warning', red: 'danger'
    };
    const colorToIcon = {
        blue: 'green', yellow: 'yellow', red: 'red'
    };
    const status = {
        blue: 'Success',
        yellow: 'Unstable',
        red: 'Failure',
        aborted: 'Aborted',
        notbuilt: 'Not built',
        disabled: 'Disabled'
    };

    function jobMapping(url, data) {
        const basicColor = (data.color || '').replace(buildingRegExp, '');
        const lastBuild = data.lastCompletedBuild || {};
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
            const job = jobMapping(url, data);
            return job;
        });
    }
}

function defaultJobDataService() {
    return function (url, status) {
        const jobNameRegExp = /.*\/job\/([^/]+)(\/.*|$)/;
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
    }
}

function JobsService(req, Storage, jenkins, defaultJobData) {
    const Jobs = {
        jobs: {},
        add: function (url, data) {
            const result = {};
            result.oldValue = Jobs.jobs[url];
            result.newValue = Jobs.jobs[url] = data || Jobs.jobs[url] || defaultJobData(url);
            return Storage.set({jobs: Jobs.jobs}).then(function () {
                return result;
            });
        },
        remove: function (url) {
            delete Jobs.jobs[url];
            return Storage.set({jobs: Jobs.jobs});
        },
        setUrls: function (urls) {
            const newJobs = {};
            urls.forEach(function (url) {
                newJobs[url] = Jobs.jobs[url] || defaultJobData(url);
            });
            Jobs.jobs = newJobs;

            return Storage.set({jobs: Jobs.jobs}).then(function () {
                return Jobs.jobs;
            });
        },
        updateStatus: function (url) {
            return jenkins(url).catch(function (res) {
                // On error, keep existing data or create default one
                const data = $.clone(Jobs.jobs[url]) || defaultJobData(url);
                data.error = (res instanceof Error ? res.message : res.statusText) || _.Unreachable;
                return data;
            }).then(function (data) {
                return Jobs.add(url, data);
            });
        },
        updateAllStatus: function () {
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

    Storage.get({options: scope.options}).then(function (objects) {
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

    Storage.get({jobs: Jobs.jobs}).then(function (objects) {
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
    const error = Utils.qs('.error');
    Utils.clearNode(document, '.omj__loading-spinner');
    return error.innerText = response.statusText || response;
}

function cleanUrl(url) {
    if (url && url.includes(`${_.DOUBLE_SLASH}${API}`)) {
        return url.replace(`${_.DOUBLE_SLASH}${API}`, `${_.SLASH}${API}`);
    }
    return url;
}

const Jenkins = {
    init: function () {
        initOptions(scope, Storage);
        initJobs(Jobs, Storage, scope);
    },
    Jobs: Jobs,
    getJobs: function (url, callback) {
        this.request(url, callback);
    },
    getJobsInfo: function (url, callback) {
        this.request(url, callback);
    },
    getBuild: function (url, callback) {
        this.request(url, callback);
    },
    request: function (url, callback) {
        url = cleanUrl(`${url}${_.API_JSON}`);
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
            Utils.log(`${_.SERVER_DOWN}${error}`);
        });
    }
};

module.exports = Jenkins;
