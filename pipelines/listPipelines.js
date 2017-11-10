var bizagiUtil = require('bz-util');
var REQUIRED = bizagiUtil.REQUIRED;
var ERROR = bizagiUtil.error;
var RESPONSE = bizagiUtil.getResponse;
var streakapi = REQUIRED('streakapi');

/**
 * @author Nestor Estrada ^^
 */

function invoke(globals, actionName, data, authenticationType, LOG, callback) {

    var streak = new streakapi.Streak(basicAuth);

    streak.Pipelines.getAll().then( function (info) {
        LOG.info(info);
        var data = '';
        info.forEach( function (e,i)  {
            i += 1;
            data += '\nPipeline number: ' + i + '\nName: ' + e.name + '\nDescription: ' + e.description + '\nPipeline Key: ' + e.pipelineKey + '\n---------------------------------';
        });
        var noPipelines = '\nNumber of pipelines: ' + info.length;
        LOG.info(data);
        var success = RESPONSE(
            {
                nomberOfPipelines: noPipelines,
                data: data,
                status: 200
            }
            , null, 200);
        LOG.info('Success: ' + success);
        callback(success);
    }).catch(function (err)  {
        LOG.info(err);
        var errParse = JSON.parse(err.str);
        var error = RESPONSE(null,
            {
                message: 'Could not get user, make sure your api-key is correct',
                error: errParse.error,
                status: 400
            }, 400);
        LOG.info('Error: ' + error);
        callback(error);
    });
}
exports.invoke = invoke;