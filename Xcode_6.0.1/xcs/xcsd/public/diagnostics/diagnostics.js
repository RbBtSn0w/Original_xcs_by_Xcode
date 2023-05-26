/*
    diagnostics.js
    A set of diagnostic tools for local processes built atop WebSocket.
*/

var PORT_XCSD = 9110;
var PORT_BUILD_SERVICE = 9111;

var RECOGNIZED_ISSUE_TYPES = ['client-cert-invalid'];

var _socket = null;

/* Initialize function */
function XCSDiagnosticsInit() {
    _socket = io.connect();
    _socket.emit('hello', {
        type: 'diagnostic'
    });
}

window.addEventListener('load', XCSDiagnosticsInit, false);

function clearPanel(panel) {
    $(panel).removeClass('connected').removeClass('connecting').removeClass('warnings').removeClass('panel-info').removeClass('panel-success').removeClass('panel-danger').removeClass('panel-warning');
}

var _openSockets = {};
var _issues = {};

function connectToService(identifier, port) {
    // find the panel representing the service
    var panel = document.querySelector('.service-panel.' + identifier);

    // update the status
    clearPanel(panel);
    $(panel).addClass('connecting').addClass('panel-info');
    panel.querySelector('.status').innerHTML = 'Connecting&hellip;';

    // open the WebSocket connection
    var wasConnected = false;
    var ws = new WebSocket('ws://localhost:' + port);
    _openSockets[identifier] = ws;

    ws.addEventListener('open', function () {
        panel.querySelector('.status').innerHTML = 'Waiting for first update&hellip;';
        wasConnected = true;
    }, false);

    ws.addEventListener('message', function (e) {
        var message = JSON.parse(e.data);

        switch (message.type) {
        case 'status':
            {
                clearPanel(panel);
                $(panel).addClass('connected');

                _issues[identifier] = message.data.issues;

                var popoverContent = '';
                for (var i = 0; i < message.data.issues.length; i++) {
                    var issue = message.data.issues[i];
                    popoverContent += '<div class="issue">';
                    if (issue.title)
                        popoverContent += '<h2>' + issue.title + '</h2>';

                    popoverContent += '<p>' + issue.message + '</p>';

                    if (issue.type && RECOGNIZED_ISSUE_TYPES.indexOf(issue.type) > -1) {
                        popoverContent += '<button type="button" class="btn btn-xs btn-primary" onclick="fixIssue(\'' + issue.type + '\');return false;">Fix This</button>';
                    }

                    popoverContent += '</div>';
                }

                var warningButton = $(panel.querySelector('.btn.warnings'));
                warningButton.popover('destroy');
                warningButton.popover({
                    title: 'Warnings',
                    html: true,
                    content: popoverContent
                });

                if (message.data.issues.length == 0) {
                    $(panel).addClass('panel-success');
                    panel.querySelector('.status').innerHTML = 'No issues reported';
                } else {
                    $(panel).addClass('panel-danger').addClass('warnings');
                    panel.querySelector('.status').innerHTML = 'Experiencing issues';
                }
            }
            break;

        case 'csr':
            {
                sendCSRToServer(message.data);
            }
            break;

        case 'certificateAccepted':
            {
                completeCSRProcess(message.data);
            }
            break;
        }
    }, false);

    ws.addEventListener('close', function () {
        delete _openSockets[identifier];

        // update the status
        if (wasConnected) {
            clearPanel(panel);
            $(panel).addClass('panel-info');
            panel.querySelector('.status').innerHTML = 'Not connected';

            wasConnected = false;
        }
    }, false);

    var connectInterval = setInterval(function () {
        if (ws.readyState == 1 || ws.readyState == 3) {
            clearInterval(connectInterval);
            if (ws.readyState == 3) {
                clearPanel(panel);
                $(panel).addClass('panel-warning');
                panel.querySelector('.status').innerHTML = 'Could not connect';
            }
        }
    }, 500);
}

function disconnectFromService(identifier) {
    // find the panel representing the service
    var panel = document.querySelector('.service-panel.' + identifier);

    // update the status
    clearPanel(panel);
    $(panel).addClass('panel-info');
    panel.querySelector('.status').innerHTML = 'Not connected';

    // close the WebSocket
    _openSockets[identifier].close();
}

function connectToBuildService() {
    connectToService('xcsbuildd', PORT_BUILD_SERVICE);
}

function disconnectFromBuildService() {
    disconnectFromService('xcsbuildd');
}

function fixIssue(issueType) {
    if (issueType == 'client-cert-invalid') {
        // we need to open a sheet so we can setup a CSR
        document.getElementById('commonName').value = '';
        document.getElementById('emailAddress').value = '';
        $('#csrModal').removeClass('working');
        $('#csrModal').modal('show');
        setTimeout(function () {
            document.getElementById('commonName').focus();
        }, 500);
    }
}

var _pendingCSRData = null;

function enrollBuildService() {
    var commonName = document.getElementById('commonName').value;
    var emailAddress = 'xcsbuildd@' + document.getElementById('emailAddress').value;

    _pendingCSRData = {
        commonName: commonName,
        emailAddress: emailAddress
    };

    var msg = {
        type: 'generateCSR',
        data: _pendingCSRData
    };
    _openSockets['xcsbuildd'].send(JSON.stringify(msg));

    document.getElementById('csrProgress').style.width = '10%';
    document.getElementById('csrProgress').className = 'progress-bar';
    document.getElementById('csrProgress').parentNode.className = 'progress progress-striped active';
    $('#csrModal').addClass('working');
}

function sendCSRToServer(csrStr) {
    document.getElementById('csrProgress').style.width = '60%';
    _socket.emit('fulfillCSR', csrStr, _pendingCSRData, function (err, certStr) {
        if (err) {
            // TODO: handle this properly
            console.log(err);
            return;
        }

        var msg = {
            type: 'useCertificate',
            data: certStr
        };
        _openSockets['xcsbuildd'].send(JSON.stringify(msg));

        document.getElementById('csrProgress').style.width = '90%';
    });
}

function completeCSRProcess(err) {
    if (err) {
        // TODO: handle this properly
        console.log(err);
        return;
    }

    var prog = document.getElementById('csrProgress');
    prog.style.width = '100%';
    prog.className = 'progress-bar progress-bar-success';
    prog.parentNode.className = 'progress';

    setTimeout(function () {
        $('#csrModal').modal('hide');
    }, 1200);
}