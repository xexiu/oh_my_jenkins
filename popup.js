import Utils from "./js/core/Utils";
import Config from "./js/core/ConfigJSON";
import Jenkins from "./js/core/Jenkins";

const WARNING_MSG = 'You did not select any views. Click here to configure it!';
const builds = Utils.qs('.omj__builds');
const mainWrapper = Utils.qs('.omj-mainWrapper');
const _ = Jenkins._;

function loadSpinner(element) {
    const spinner = document.createElement('img');
    spinner.alt = 'Loading...';
    spinner.src = 'img/spinner.gif';
    spinner.className = 'omj__loading-spinner';
    if (!Utils.isAlreadyCreated('.omj__loading-spinner')) {
        return element.insertAdjacentElement('afterend', spinner);
    }
}

function noViewsSelectedError() {
    const error = Utils.qs('.error');
    const aElement = document.createElement('a');
    aElement.href = chrome.extension.getURL('options.html');
    aElement.innerText = WARNING_MSG;
    error.appendChild(aElement);
    chrome.browserAction.setBadgeText({text: 'Loading...'});
    chrome.browserAction.setBadgeBackgroundColor({color: 'black'});
}

function getViews(views) {
    Utils.log('Build job with: ', views);
    views.forEach(view => {
        Jenkins.getJobs(view, buildJobs)
    });
}

function buildJobs(views) {
    const viewName = views.name;
    const node = Utils.qs('.omj__wrapperView');
    const clone = node.cloneNode(true);
    const view = clone.querySelector('.omj__leftWrapper .omj__viewName');
    view.innerText = viewName;
    views.jobs.map((job, index) => {
        const jobName = clone.querySelector('.omj__leftWrapper .omj__viewName');
        jobName.innerText =  job;

        /*jobs.appendChild(usedJob);
        Jenkins.getJobsInfo(job.url, getLastExecution);*/
    });
    mainWrapper.appendChild(clone);
    /*_.forEach(node.querySelectorAll('.omj__viewName'), function (el) {
        el.innerText = viewName;
    });*/
    /*if (view && view.jobs) {
        const jobs = Utils.qs('.omg__jobs');
        view.jobs.map((job, index) => {
            const usedJob = document.createElement('div');
            usedJob.className = `.omg__jobs--${index}`;
            usedJob.setAttribute('data-job-url', job.url);
            jobs.appendChild(usedJob);
            Jenkins.getJobsInfo(job.url, getLastExecution);
        });
    }*/
}

function getLastExecution(data, options) {
    const lastBuildUrl = data && data.lastBuild.url;
    Jenkins.getBuild(lastBuildUrl, options.user, options.token, showBuildInfo);
}

function showBuildInfo(data) {
    const wrapper = document.createElement('div');
    const props = getDataProperties(data);
    cleanProps(props);
    if (props.hasUpstreamProjects) {
        wrapper.innerHTML = Config.template.upstream(props, data);
    } else {
        wrapper.innerHTML = Config.template.default(props, data);
    }
    wrapper.className = 'omj__build-' + data.result.toLowerCase();
    builds.appendChild(wrapper);

    if (data.result === 'FAILURE') {
        chrome.browserAction.setBadgeText({text: '1'});
        chrome.browserAction.setBadgeBackgroundColor({color: Config.status[data.result]});
    } else if (data.result === 'UNSTABLE') {
        chrome.browserAction.setBadgeText({text: '1'});
        chrome.browserAction.setBadgeBackgroundColor({color: Config.status[data.result]});
    }
}

function cleanProps(props) {
    props.hasUpstreamProjects = props.hasUpstreamProjects && props.hasUpstreamProjects.toString().replace(/,/g, '');
    props.upstreamBuild = props.upstreamBuild && props.upstreamBuild.toString().replace(/,/g, '');
    props.upstreamProject = props.upstreamProject && props.upstreamProject.toString().replace(/,/g, '');
}

function getDataProperties(data) {
    return {
        hasUpstreamProjects: getUpStreamInfo(data, 'parameters', 'name'),
        buildName: data.fullDisplayName,
        url: data.url,
        branch: getUpStreamInfo(data, 'name'),
        commitId: getUpStreamInfo(data, 'SHA1'),
        shortDescription: getUpStreamInfo(data, 'shortDescription'),
        commitMsg: data && data.hasOwnProperty('changeSet') && data.changeSet.items[0] && data.changeSet.items[0].msg,
        upstreamBuild: getUpStreamInfo(data, 'parameters', 'number'),
        upstreamProject: getUpStreamInfo(data, 'parameters', 'jobName')
    }
}

function getUpStreamInfo(data, attrName, extraAttrs) {
    for (let i = 0; i < data.actions.length; i++) {
        const revision = data.actions[i];
        if (revision.hasOwnProperty('causes') && revision.causes[0].hasOwnProperty(attrName)) {
            return revision.causes[0][attrName];
        } else if (revision.hasOwnProperty('lastBuiltRevision')) {
            return revision.lastBuiltRevision.branch[0][attrName];
        } else if (revision.hasOwnProperty(attrName)) {
            return revision.parameters.map(attr => {
                if (attr.name === 'PARENT_BUILD') {
                    return attr[extraAttrs];
                }
            })
        }
    }
}

/*function logUser(ev) {
 ev.preventDefault();
 loadSpinner(logInBtn);
 const form = ev.target.parentNode;
 const values = getInputsValues(form);
 Config.username = 'sergio.mironescu@marfeel.com'; //value[0];
 Config.token = '0a64474008e850b439353d2929013e13'; //value[1];
 Config.host = 'bobthebuilder.marfeel.com'; //value[2];
 Config.port = '8443'; //value[3];

 const host = `https://${Config.host}:${Config.port}`;

 Jenkins.init(host, function (data) {
 Utils.log('init: ', data)
 });
 }*/

const app = {
    init: function () {
        chrome.runtime.sendMessage({fn: 'savedViews'}, function (response) {
            Utils.log('Saved views are: ', response.saved_views);
            if (response && response.saved_views.length > 0) {
                getViews(response.saved_views);
            } else {
                noViewsSelectedError();
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', Jenkins.initDebug.buildLeftTemplate);
