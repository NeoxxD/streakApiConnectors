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
        search = input.Search,
        basicAuth = globals.authdata.BasicAuth;

    var streak = new streakapi.Streak(basicAuth);

    streak.search(search).then(function (info) {
        console.log(JSON.stringify(info.results.boxes));
        var data = '';
        var resu = null;
        info.forEach( function (e,i) {
            resu += i;
            var unaString = (e.notes !== undefined) ? 'Notes: ' + e.notes : '';
            data += '\nBox number ' + (i + 1) + '\nName box: ' + e.name + '\nBox key: ' + e.boxKey + '\n' + unaString + '\n------------------------------------------------------------';
        });
        var inf = '\nNumber of boxes: ' + resu;
    }).catch(function (err) {
        console.log(err);
        res.status(400).send('ERROR ERROR');
    });

}

exports.invoke = invoke;