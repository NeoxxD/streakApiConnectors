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
        basicAuth = globals.authdata.BasicAuth;

    var streak = new streakapi.Streak(basicAuth);

    streak.Pipelines.Fields.getAll(pipelineKey).then(function (info) {
        LOG.info(info);
        var data = '';
        info.forEach(function (e, i) {
            data += '\nName: ' + e.name + '\nField key: ' + e.key + '\nLast update timestamp: ' + e.lastUpdatedTimestamp + '\n---------------------------';
        });
        var success = RESPONSE(
            {
                data: data,
                status: 200
            }, null, 200);
        LOG.info('Success: ' + success);
        callback(success);
    }).catch(function (err) {
        LOG.info(err);
        var errParse = JSON.parse(err.str);
        var error = RESPONSE(null,
            {
                message: 'Could not get all fields, make sure your api-key and pipeline-key is correct',
                error: errParse.error,
                status: 400
            }, 400);
        LOG.info('Error: ' + error);
        callback(error);
    });

}

exports.invoke = invoke;