const configJSON = {
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
