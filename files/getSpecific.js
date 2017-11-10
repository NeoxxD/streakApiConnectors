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
        fileKey = input.FileKey;
    basicAuth = globals.authdata.BasicAuth;

    var streak = new streakapi.Streak(basicAuth);

    streak.Files.getOne(fileKey)
        .then(function (info) {
                var data =
                    '\nFile name: ' + info.fileName +
                    '\nFile type: ' + info.fileType +
                    '\nFile owner: ' + info.fileOwner +
                    '\nMime type: ' + info.mimeType +
                    '\nFile key: ' + info.fileKey;
            var success = RESPONSE(
                {
                    statusInfo: 'Obtained specific files',
                    status: data
                }
                , null, 200);
            LOG.info('Success: ' + success);
            callback(success);
        }).catch(function (err) {
        var errParse = JSON.parse(err.str);
        var error = RESPONSE(
            {
                statusInfo: 'Could not get specific files, make sure your api-key and box-key is correct',
                status: errParse.error
            }, null, 400);
        LOG.info('Error: ' + error);
        callback(error);
    })

}

exports.invoke = invoke;