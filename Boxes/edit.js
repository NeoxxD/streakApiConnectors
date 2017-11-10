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
        name = input.Name,
        notes = input.Notes,
        basicAuth = globals.authdata.BasicAuth;

    var streak = new streakapi.Streak(basicAuth);

    streak.Boxes.update(
        {
            name: name,
            notes: notes,
            key: boxKey
        }).then(function (info) {
            var success = RESPONSE(
                {
                    boxName: info.name,
                    boxKey:info.boxKey,
                    notes: info.notes,
                    totalTask: info.taskTotal,
                    incompleteTask: info.taskIncompleteCount,
                    status: 200
                }
                , null, 200);
            LOG.info('Success: ' + success);
            callback(success);
        }).catch(function (err) {
        var errParse = JSON.parse(err.str);
        var error = RESPONSE(null,
            {
                message: 'Could not update the box, make sure your api-key and box-key is correct',
                error: errParse.error,
                status: 400
            }, 400);
        LOG.info('Error: ' + error);
        callback(error);
    });

}

exports.invoke = invoke;