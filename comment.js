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
        message = input.Message,
        boxKey = input.BoxKey,
        basicAuth = globals.authdata.BasicAuth;

    var options = {
        url: 'https://www.streak.com/api/v1/boxes/'+ boxKey +'/comments?message=' + message,
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
    request.put(options, function (err, resp, body) {
        var resParse = JSON.parse(resp.body);
        var timestamp = new Date(resParse.timestamp);
        var data = '\nMessage: ' + resParse.message + '\nComment key: ' + resParse.commentKey + '\nTimestamp: ' + timestamp + '\nStatus code: ' + resp.statusCode;
        if (resp.statusCode == 200) {
            var success = RESPONSE(
                {
                    statusInfo: 'Created comment',
                    status: data
                }, null, 200);
            LOG.info('Success: ' + success);
            callback(success);
        } else {
            var error = RESPONSE(
                {
                    status: 'Could not create comment, make sure your api-key and box-key is correct',
                    statusInfo: 'Error: ' + resParse.error
                }, null , 400);
            LOG.info('Error: ' + error);
            callback(error);
        }
    });

}

exports.invoke = invoke;