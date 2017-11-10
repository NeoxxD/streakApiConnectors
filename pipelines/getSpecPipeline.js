var bizagiUtil = require('bz-util');
var REQUIRED = bizagiUtil.REQUIRED;
var ERROR = bizagiUtil.error;
var RESPONSE = bizagiUtil.getResponse;
var streakapi = REQUIRED ('streakapi');

/**
 * @author Nestor Estrada ^^
*/

function invoke(globals, actionName, data, authenticationType, LOG, callback) {

    var pipelineKey = data.inputs.input.pipelineKey,
        basicAuth = globals.authdata.BasicAuth;

    var streak = new streakapi.Streak(basicAuth);

    streak.Pipelines.getOne(pipelineKey).then( function (info) {
        LOG.info(info);
        var success = RESPONSE(
            {
                pipelineName: info.name,
                description: info.description,
                pipelineKey: info.pipelineKey,
                userName:  info.aclEntries[0].fullName,
                email: info.aclEntries[0].email,
                status: 200
            }
            , null, 200);
        LOG.info('Success: ' + success);
        callback(success);
    }).catch( function (err) {
        LOG.info(err);
        var errParse = JSON.parse(err.str);
        var error = RESPONSE( null,
            {
                message: 'Could not get a specific pipeline, make sure your api-key and pipeline-key is correct',
                error: errParse.error,
                status: 400
            }, 400);
        LOG.info('Error: ' + error);
        callback(error);
    });
}

exports.invoke = invoke;