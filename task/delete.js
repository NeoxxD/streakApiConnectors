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
        taskKey = input.BoxKey,
        basicAuth = globals.authdata.BasicAuth;

    var options = {
        url: 'https://www.streak.com/api/v2/tasks/' + taskKey,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic NmQxZTA5OWU5OThmNGJhMzg0ZTcxZGE4M2VmMjdmMTI6'
        },
        auth: {
            user: basicAuth,
            pass: '',
            sendImmediately: true
        }
    };
    LOG.info(options);
    request.delete(options, function (err, resp, body) {
        LOG.info(resp.body);
        var resParse = JSON.parse(resp.body);
        if (resp.statusCode == 200) {
            var success = RESPONSE(
                {
                    success: resParse.success,
                    status: 200
                }, null, 200);
            LOG.info('Success: ' + success);
            callback(success);
        } else {
            var error = RESPONSE(null,
                {
                    message: 'Could not delete task, make sure your api-key and task-key is correct',
                    error: 'Success: ' + resParse.success + 'Error: ' + resParse.error,
                    status: 400
                } , 400);
            LOG.info('Error: ' + error);
            callback(error);
        }
    });

}

exports.invoke = invoke;