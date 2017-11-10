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
        taskKey = input.TaskKey,
        text = input.Text,
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
        },
        body:{
            text: text
        },
        json: true

    };
    LOG.info(options);
    request.post(options, function (err, resp, body) {
        var data = '\nTask text: ' + resp.body.text + '\nTask key: ' + resp.body.key + '\nStatus code: ' + resp.statusCode +'\n-----------------------------------';
        var dataToString = data.toString();
        if (resp.statusCode == 200) {
            var success = RESPONSE(
                {
                    statusInfo: 'update task',
                    status: data
                }, null, 200);
            LOG.info('Success: ' + success);
            callback(success);
        } else {
            var error = RESPONSE(
                {
                    status: 'Could not update task, make sure your api-key and task-key is correct',
                    statusInfo: 'Error: ' + resp.body.error + 'Status code: ' + resp.statusCode
                }, null , 400);
            LOG.info('Error: ' + error);
            callback(error);
        }
    });

}

exports.invoke = invoke;