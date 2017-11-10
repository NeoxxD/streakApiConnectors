var bizagiUtil = require('bz-util');
var REQUIRED = bizagiUtil.REQUIRED;
var ERROR = bizagiUtil.error;
var RESPONSE = bizagiUtil.getResponse;
var request = REQUIRED('request');

/**
 * @author Nestor Estrada ^^
 */

function invoke(globals, actionName, data, authenticationType, LOG, callback) {

    var input = data.inputs.input,
        text = input.Text,
        boxKey = input.BoxKey,
        basicAuth = globals.authdata.BasicAuth;

    var options = {
        url: 'https://www.streak.com/api/v2/boxes/' + boxKey + '/tasks?text=' + text,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic NmQxZTA5OWU5OThmNGJhMzg0ZTcxZGE4M2VmMjdmMTI6'
        },
        auth: {
            user: basicAuth,
            pass: '',
            sendImmediately: false
        }
    };
    LOG.info(options);
    request.post(options, function (err, resp, body) {
        var resParse = JSON.parse(resp.body);
        if (resp.statusCode == 200) {
            var success = RESPONSE(
                {
                    textTask:  resParse.text,
                    taskKey: resParse.key,
                    status: resp.statusCode
                }, null, 200);
            LOG.info('Success: ' + success);
            callback(success);
        } else {
            var error = RESPONSE(null,
                {
                    message: 'Could not create task, make sure your api-key and box-key is correct',
                    error: 'Error: ' + resParse.error,
                    status: resp.statusCode
                } , 400);
            LOG.info('Error: ' + error);
            callback(error);
        }
    });

}

exports.invoke = invoke;