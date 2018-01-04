define(function () {
    'use strict';

    return window._omj = {
        method: {
          GET: 'GET',
            POST: 'POST'
        },
        request: {
            defaults: {
                rejectUnauthorized: false
            }
        },
        isAuth: 'authenticated',
        jobs: [
            {
                id: 'build',
                displayName: 'Build',
                eventName: 'build',
                cronInterval: '*/5 * * * * *',
                apiMethod: 'last_build_info',

                displayArguments: {
                    title_isEnabled: true,
                    buildNumber_isEnabled: true,
                    timeAgo_isEnabled: true,
                    branch_isEnabled: true,
                    displayDuration_isEnabled: true
                },

                parameterizedAttributes: [
                    {
                        attributeName: 'branch',
                        jenkinsParameterName: 'BRANCH_TO_BUILD'
                    }
                ]
            },
            {
                id: 'static_code_analysis',
                displayName: 'Static Code Analysis',
                eventName: 'static_code_analysis',
                cronInterval: '*/5 * * * * *',
                apiMethod: 'last_build_info',

                displayArguments: {
                    title_isEnabled: true,
                    buildNumber_isEnabled: false,
                    timeAgo_isEnabled: true,
                    branch_isEnabled: false,
                    displayDuration_isEnabled: true
                }
            },
            {
                id: 'install_latest',
                displayName: 'Install Latest',
                eventName: 'install_latest',
                cronInterval: '*/5 * * * * *',
                apiMethod: 'last_build_info',

                externalBuildNumber: {
                    url: 'http://latest.your_application_url.host/build.txt'
                },

                displayArguments: {
                    title_isEnabled: true,
                    buildNumber_isEnabled: true,
                    timeAgo_isEnabled: true,
                    branch_isEnabled: false,
                    displayDuration_isEnabled: true
                }
            }
        ]
    }
});
