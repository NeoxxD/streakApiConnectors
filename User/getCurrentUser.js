var bizagiUtil = require('bz-util');
var REQUIRED = bizagiUtil.REQUIRED;
var ERROR = bizagiUtil.error;
var RESPONSE = bizagiUtil.getResponse;
var streakapi = require ('streakapi');
/**
 * @author Nestor Estrada ^^
 */

function invoke(globals, actionName, data, authenticationType, LOG, callback) {
    /**
     * Tu código va aquí
     */
    var input = data.inputs.input,
        basicAuth = globals.authdata.BasicAuth;

    var streak = new streakapi.Streak(basicAuth);

    streak.Me.get().then(function (info) {
        LOG.info(info);
        var success = RESPONSE(
            {
                googleProfileFullName: info.googleProfileFullName,
                email: info.email,
                userKey: info.userKey,
                status: 200
            }
            , null, 200);
        LOG.info(success);
        callback(success);
    }).catch(function (err) {
        LOG.info(err);
        var errParse = JSON.parse(err.str);
        var error = RESPONSE(
            null ,
            {
                message: 'Could not get user, make sure your api-key is correct',
                error: errParse.error,
                status: 400
            }, 400);
        LOG.info(error);
        callback(error);
    });
}

exports.invoke = invoke;