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
        boxKey = input.BoxKey,
        basicAuth = globals.authdata.BasicAuth;

    var options = {
        url: 'https://www.streak.com/api/v2/boxes/' + boxKey + '/tasks',
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
    request.get(options, function (err, resp, body) {
        var resParse = JSON.parse(resp.body);
        var data = '';
        resParse.results.forEach(function (e,i) {
            data += '\nTask text: ' + e.text + '\nTask key: ' + e.key + '\n-----------------------------------';
        });
        if (resp.statusCode == 200) {
            var success = RESPONSE(
                {
                    statusInfo: 'get all task for boxes',
                    status: data
                }, null, 200);
            LOG.info('Success: ' + success);
            callback(success);
        } else {
            var error = RESPONSE(
                {
                    status: 'Could not get all task for boxes, make sure your api-key and box-key is correct',
                    statusInfo: 'Error: ' + resParse.error
                }, null , 400);
            LOG.info('Error: ' + error);
            callback(error);
        }
    });

}

exports.invoke = invoke;