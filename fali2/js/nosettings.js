Utils.log('NOSETTINGS');
const saveBtn = document.querySelector('#btn');

function getJenkinsUrls (form) {
    let jenkinsUrls = [];
    for (var i = 0; i < form.elements.length; i++) {
        var input = form[i];
        if(input.name  === 'jenkins-url') {
            jenkinsUrls.push(input.value);
        }
    }
    return jenkinsUrls;
}

function drawSavedUrls(element) {
    chrome.storage.local.get('jenkins_data', function(items) {
        if (items['jenkins_data']) {
            const urls = items['jenkins_data'];
            for (var i = 0; i < urls.length; i++) {
                var url = urls[i];
                var div = document.createElement('div');
                div.className = 'view' + i;
                div.innerText = '';
                div.innerText = url;
                element.parentNode.appendChild(div);
            }
        }
    });
}

saveBtn.addEventListener('click', function (ev) {
    ev.preventDefault();
    const form = ev.target.parentNode;
    const jenkins_data = getJenkinsUrls(form);
    chrome.storage.local.set({'jenkins_data': jenkins_data});
    drawSavedUrls(ev.target)
});

