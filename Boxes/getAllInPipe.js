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
        pipelineKey = input.PipelineKey;
        basicAuth = globals.authdata.BasicAuth;

    var streak = new streakapi.Streak(basicAuth);

    streak.Boxes.getForPipeline(pipelineKey)
        .then(function (info) {
            LOG.info(info);
            var data = '';
            info.forEach( function (e,i) {
                var notes = (e.notes !== undefined) ? 'Notes: ' + e.notes : '';
                data += '\nBox number ' + (i + 1) + '\nName box: ' + e.name + '\nBox key: ' + e.boxKey + '\n' + notes + '\n------------------------------------------------------------';
            });
            var numberBoxes = '\nNumber of boxes: ' + info.length;
            var success = RESPONSE(
                {
                    numberOfBoxes: numberBoxes,
                    data: data,
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
                message: 'Could not get all boxes in pipeline, make sure your api-key and pipeline-key is correct',
                error: errParse.error,
                status: 400
            }, 400);
        LOG.info('Error: ' + error);
        callback(error);
    })

}

exports.invoke = invoke;