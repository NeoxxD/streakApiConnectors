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
        pipelineKey = input.PipelineKey,
        fieldKey = input.fieldKey,
        basicAuth = globals.authdata.BasicAuth;

    var streak = new streakapi.Streak(basicAuth);

    streak.Pipelines.Fields.delete(pipelineKey, fieldKey)
        .then(function (info) {
            LOG.info(info);
            var success = RESPONSE(
                {
                    success: info.success,
                    status: 200
                }, null, 200);
            LOG.info('Success: ' + success);
            callback(success);
        })
        .catch(function (err) {
            LOG.info(err);
            var errParse = JSON.parse(err.str);
            var error = RESPONSE(null,
                {
                    message: 'Could not delete field, make sure your api-key, pipeline-key and field-key is correct',
                    error: '\nSuccess: ' + errParse.success + '\nError: ' + errParse.error,
                    status: 400
                }, 400);
            LOG.info('Error: ' + error);
            callback(error);
        });
}

exports.invoke = invoke;