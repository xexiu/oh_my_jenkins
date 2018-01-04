define([
    './Utils',
    './ConfigJSON'
], function (Utils, ConfigJSON) {
    'use strict';
    
    function errorResponse(response) {
        const error = document.body.querySelector('.error');
        Utils.clearNode(document, '.omj__loading-spinner');
        return error.innerText = response.statusText;
    }

    return {
        init: function (host, user, token, callback) {
            const domain = host.split("@")[2];
            const url = `${ConfigJSON.HTTPS}${domain}/user/${user}${ConfigJSON.API}`;

            this.request(url, 'GET', callback, {user, token});
        },
        request: function (url, method, callback, options) {
            fetch(url, {
                method: method,
                headers: {
                    "Authorization": 'Basic ' + btoa(`${options.user}:${options.token}`)
                },
                mode: 'cors'
            }).then(function (response) {
                if (response.status === ConfigJSON.HTTP_CODE_401) {
                    return errorResponse(response);
                } else {
                    Utils.clearNode(document, '.omj__loading-spinner');
                    Utils.clearNode(document, '.omj__form-style');
                    response.json().then(function (data) {
                        return callback ? callback(data, options) : data;
                    });
                }
            }).catch(function (e) {
                console.log('Must be a timeout! Server is down? ErrorCode: ' + e);
            });
        }
    }
});

