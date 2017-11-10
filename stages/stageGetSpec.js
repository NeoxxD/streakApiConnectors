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
        stageKey = input.StageKey,
        basicAuth = globals.authdata.BasicAuth;

    var streak = new streakapi.Streak(basicAuth);

    streak.Pipelines.Stages.getOne(pipelineKey, stageKey)
        .then(function (info) {
            var success = RESPONSE(
                {
                    stageName: info.name,
                    stageKey: info.key,
                    boxCount: info.boxCount,
                    status: 200
                }
                , null, 200);
            LOG.info('Success: ' + success);
            callback(success);
        }).catch(function (err) {
        var errParse = JSON.parse(err.str);
        var error = RESPONSE(null,
            {
                message: 'Could not get stages, make sure your api-key, pipeline-key and stage-key is correct',
                error: errParse.error,
                status:400
            }, 400);
        LOG.info('Error: ' + error);
        callback(error);
    });

}

exports.invoke = invoke;