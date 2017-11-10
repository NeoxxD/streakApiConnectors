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
        name = input.Name,
        basicAuth = globals.authdata.BasicAuth;

    var streak = new streakapi.Streak(basicAuth);

    streak.Pipelines.Stages.create(pipelineKey, {name: name} )
        .then(function (info) {
            LOG.info(info);
            var success = RESPONSE(
                {
                    name: info.name,
                    stageKey: info.key,
                    numberBox: info.boxCount,
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
                message: 'Could not create stage, make sure your api-key and pipeline-key is correct',
                error: errParse.error,
                status: 400
            }, 400);
        LOG.info('Error: ' + error);
        callback(error);
    });
}

exports.invoke = invoke;