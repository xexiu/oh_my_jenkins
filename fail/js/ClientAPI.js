define([
    './Jenkins',
    './Utils',
    './Config.jenkins_job'
], function (Jenkins, Utils, Config) {
    'use strict';

    function createTemplate(element, className){
        const node = document.createElement(element);
        node.className = className;
    }

    function renderJobsLateralMenu(data){
        const nav = Utils.qs('.omj__nav');
        data.jobs.forEach(function (job) {
        });
        console.log(data)
    }

    function setCookie() {
        document.cookie = 'cookie1=test; expires=Fri, 3 Aug 2018 20:47:11 UTC; path=/'
    }

    function setUserName(user) {
        const headerTitle = Utils.qs('h2');
        headerTitle.innerText = user.fullName;
    }

    function getUserName(data, user, token) {
        const userUrl = `${data.primaryView.url}/user/${user}/api/json`;
        return Jenkins.request(userUrl, Config.method.GET, setUserName, { user, token})
    }

    return {
        build: function (data, options) {
            const user = options.user || '';
            const token = options.token || '';

            if (data) {
                setCookie();
                getUserName(data, user, token);
                renderJobsLateralMenu(data);
                //console.log(data, user);
            }
        }
    }
});



