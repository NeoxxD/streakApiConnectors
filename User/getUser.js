var bizagiUtil = require('bz-util');
var REQUIRED = bizagiUtil.REQUIRED;
var ERROR = bizagiUtil.error;
var RESPONSE = bizagiUtil.getResponse;
var request = REQUIRED('request');

/**
 * @author Nestor Estrada ^^
 */

function invoke(globals, actionName, data, authenticationType, LOG, callback) {

    var basicAuth = globals.authdata.BasicAuth,
        userKey = data.inputs.input.UserKey;

    var options = {
        url: 'https://www.streak.com/api/v1/users/' + userKey,
        auth: {
            'user': basicAuth,
            'pass': '',
            'sendImmediately': false
        },
        headers: {
            'Authorization': 'Basic NmQxZTA5OWU5OThmNGJhMzg0ZTcxZGE4M2VmMjdmMTI6'
        }

    };
    LOG.info(options);
    request.get(options, function (err, resp, body) {

        var resParse = JSON.parse(resp.body);
        LOG.info(resp.body);
        if (resp.statusCode == 200) {

            var success = RESPONSE(
                {
                    name: resParse.googleProfileFullName,
                    email: resParse.email,
                    orgKey: resParse.orgKey,
                    userSettingKey: resParse.userSettingsKey,
                    timeZoneId: resParse.timezoneId,
                    status: resParse.statusCode
                }, null, 200);
            LOG.info('Success: ' + success);
            callback(success);
        } else {
            var error = RESPONSE(null,
                {
                    error: 'Error: ' + resParse.error,
                    message: 'Could not get user, make sure your api-key and user-key is correct',
                    status: resParse.statusCode
                }
                , 400);
            LOG.info('Error: ' + error);
            callback(error);
        }

    });
}

exports.invoke = invoke;