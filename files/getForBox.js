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

    streak.Files.getForBox(boxKey)
        .then(function (info) {
            var data = '---------------------------------';
            info.forEach(function (e,i) {
                data +=
                    '\nFile name: ' + e.fileName +
                    '\nFile type: ' + e.fileType +
                    '\nFile owner: ' + e.fileOwner +
                    '\nMime type: ' + e.mimeType +
                    '\nFile key: ' + e.fileKey +
                    '\n---------------------------------'
            });
            var success = RESPONSE(
                {
                    statusInfo: 'Obtained files for box',
                    status: data
                }
                , null, 200);
            LOG.info('Success: ' + success);
            callback(success);
        }).catch(function (err) {
        var errParse = JSON.parse(err.str);
        var error = RESPONSE(
            {
                statusInfo: 'Could not get files for box, make sure your api-key and box-key is correct',
                status: errParse.error
            }, null, 400);
        LOG.info('Error: ' + error);
        callback(error);
    })

}

exports.invoke = invoke;