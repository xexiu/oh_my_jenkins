import Utils from "./js/core/Utils";
import Jenkins from "./js/core/Jenkins";
import Config from "./js/core/ConfigJSON";

(function () {
    Jenkins.init();
    const scope = Jenkins.scope;
    const Jobs = Jenkins.Jobs;
    const $q = Jenkins.$q;
    const _ = Jenkins._;

    scope.on(Config.jobs.JOBS_INITIALIZED, function (event, jobs) {
        //Jobs.updateAllStatus().then($q.all).then(Services.buildWatcher);
        console.log(event, jobs)
    });

    scope.on(Config.jobs.JOBS_CHANGED, function (event, jobs) {
        const counts = {};
        _.forEach(jobs, function (data) {
            if (data.jobs) {
                _.forEach(data.jobs, function (viewJob) {
                    counts[viewJob.status] = (counts[viewJob.status] || Config.ZERO) + Config.ONE;
                });
            } else {
                counts[data.status] = (counts[data.status] || Config.ZERO) + Config.ONE;
            }
        });

        const count = counts.Failure || counts.Unstable || counts.Success || Config.ZERO;
        const color = counts.Failure ? '#c9302c' : counts.Unstable ? '#f0ad4e' : '#5cb85c';
        chrome.browserAction.setBadgeText({text: count.toString()});
        chrome.browserAction.setBadgeBackgroundColor({color: color});
    });
})();
