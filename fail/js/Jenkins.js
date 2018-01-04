define([
    './Utils'
], function (Utils) {
    'use strict';

    const API = '/api/json';
    const HTTPS = 'https://';
    const HTTP_CODE_401 = 401;

    function errorResponse(response) {
        const error = document.body.querySelector('.error');
        Utils.clearNode(document, '.omj__loading-spinner');
        return error.innerText = response.statusText;
    }

    return {
        init: function (host, user, token, callback) {
            const domain = host.split("@")[2];
            const url = `${HTTPS}${domain}${API}`;

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
                if (response.status === HTTP_CODE_401) {
                    return errorResponse(response);
                } else {
                    Utils.clearNode(document, '.omj__loading-spinner');
                    Utils.clearNode(document, '.omj__form-style');
                    response.json().then(function (data) {
                        return callback ? callback(data, options) : data;
                    });
                }
            });
        }
    }
});

