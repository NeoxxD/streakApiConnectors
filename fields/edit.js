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
        fieldKey = input.FieldKey,
        name = input.Name,
        pipelineKey = input.PipelineKey,
        basicAuth = globals.authdata.BasicAuth;

    var streak = new streakapi.Streak(basicAuth);

    streak.Pipelines.Fields.update(pipelineKey,
        {
            name: name,
            key: fieldKey
        }).then(function (info) {
        LOG.info(info);
        var success = RESPONSE(
            {
                nameField: info.name,
                fieldKey: info.key,
                type: info.type,
                lastUpdatedTimestamp: info.lastUpdatedTimestamp,
                status: 200
            }
            , null, 200);
        LOG.info('Success: ' + success);
        callback(success);
    }).catch(function (err) {
        LOG.info(err);
        var errParse = JSON.parse(err.str);
        var error = RESPONSE(null,
            {
                message: 'Could not update field, make sure your api-key, pipeline-key and field-key is correct',
                error: errParse.error,
                status: 400
            }, 400);
        LOG.info('Error: ' + error);
        callback(error);
    });

}

exports.invoke = invoke;