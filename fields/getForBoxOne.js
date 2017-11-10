var bizagiUtil = require('bz-util');
var REQUIRED = bizagiUtil.REQUIRED;
var ERROR = bizagiUtil.error;
var RESPONSE = bizagiUtil.getResponse;
var streakapi = REQUIRED ('streakapi');

/**
 * @author Nestor Estrada ^^
 */

function invoke(globals, actionName, data, authenticationType, LOG, callback) {

    var input = data.inputs.input,
        boxKey = input.BoxKey,
        fieldKey = input.FieldKey,
        basicAuth = globals.authdata.BasicAuth;

    var streak = new streakapi.Streak(basicAuth);

    streak.Boxes.Fields.getOne(boxKey, fieldKey).then(function (info) {
        LOG.info(info);
        var success = RESPONSE(
            {
                fieldKey: info.key,
                value: info.value,
                status: 200
            }, null, 200);
        LOG.info('Success: ' + success);
        callback(success);
    }).catch(function (err) {
        LOG.info(err);
        var errParse = JSON.parse(err.str);
        var error = RESPONSE(null,
            {
                message: 'Could not get specific values for box, make sure your api-key, box-key and field-key is correct',
                error: errParse.error,
                status: 400
            }, 400);
        LOG.info('Error: ' + error);
        callback(error);
    });
}

exports.invoke = invoke;