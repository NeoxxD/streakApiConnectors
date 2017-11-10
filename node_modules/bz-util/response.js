/**
 *
 * @author JarveinR
 *
 */

var autotesting = require('./autotesting');

function getResponse(response, error, connectorStatusCode, errorMessage) {
    var success = true;

    if (response) {
        if (typeof response !== 'object') {
            try {
                response = JSON.parse(response);
                success = true;
            } catch (e) {
                response = {};
                errorMessage = "The response must be a valid JSON: " + response;
                success = false;
            }
        }
    }
    else {
        response = {};
    }

    if (error) {
        if (typeof error !== 'object') {
            try {
                error = JSON.parse(error);
            } catch (e) {
                error = {};
                errorMessage = "The error must be a valid JSON: " + error;
                success = false;
            }
        }
        if (!isEmpty(error)) {
            success = false;
        }
    }
    else {
        error = {};
    }

    if (errorMessage) {
        if (typeof errorMessage === 'object') {
            errorMessage = JSON.stringify(errorMessage);
        }
        else {
            errorMessage = errorMessage.toString();
        }
    }
    else {
        if (!isEmpty(error)) {
            errorMessage = JSON.stringify(error);
        }
        else {
            errorMessage = "";
        }
    }

    if (errorMessage != "") {
        success = false;
    }

    if (!connectorStatusCode && success) {
        connectorStatusCode = 200;
    }

    if (!connectorStatusCode && !success) {
        connectorStatusCode = -200;
    }

    var outputs = {
        response: {
            outputs: {
                output: response,
                error: error
            }
        },
        success: success,
        connectorstatuscode: connectorStatusCode,
        errormessage: errorMessage
    };

    outputs.autotestingenabled = false;
    if (autotesting.isAutotestingEnable()) {
        outputs.autotestingenabled = true;
    }

    return outputs;
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

exports.getResponse = getResponse;