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
        boxKey = input.BoxKey;
    basicAuth = globals.authdata.BasicAuth;

    var streak = new streakapi.Streak(basicAuth);

    streak.Boxes.getOne(boxKey)
        .then(function (info) {
            LOG.info(info);
            var timestamp = {
                creationTimestamp: new Date(info.creationTimestamp),
                lastUpdateTimestamp: new Date(info.lastUpdatedTimestamp),
                lastStageChangeTimestamp: new Date(info.lastStageChangeTimestamp),
                lastCommentTimestamp: new Date(info.lastCommentTimestamp)
            };
            var timesToString = JSON.stringify(timestamp);
            var success = RESPONSE(
                {
                    boxName: info.name,
                    boxKey:  info.boxKey,
                    notes: info.notes,
                    totalTask:  info.taskTotal,
                    incompleteTask: info.taskIncompleteCount,
                    taskPercentageComplete: info.taskPercentageComplete,
                    timestamps: timesToString,
                    status: data
                }
                , null, 200);
            LOG.info('Success: ' + success);
            callback(success);
        }).catch(function (err) {
        LOG.info(err);
        var errParse = JSON.parse(err.str);
        var error = RESPONSE(null,
            {
                message: 'Could not get specific box in pipeline, make sure your api-key and box-key is correct',
                error: errParse.error,
                status: 400
            }, 400);
        LOG.info('Error: ' + error);
        callback(error);
    })

}

exports.invoke = invoke;
