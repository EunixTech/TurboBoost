exports.sendSuccessJSONResponse = (res = null, data = null, httpStatusCode = null) => {

    if (res) {
        let httpStatusCodeToUse = 200;
        if (httpStatusCode && Number(httpStatusCode)) httpStatusCodeToUse = Number(httpStatusCode);

        return res.status(httpStatusCodeToUse).json({
            status: httpStatusCodeToUse,
            ...data
        });
    }
}

exports.sendFailureJSONResponse = (res = null, data = null, httpStatusCode = null) => {
    if (res) {
        let httpStatusCodeToUse = 400;
        if (httpStatusCode && Number(httpStatusCode)) httpStatusCodeToUse = Number(httpStatusCode);

        return res.status(200).json({
            status: httpStatusCodeToUse,
            ...data
        });
    }
}

exports.sendErrorJSONResponse = (res = null, message = `Error occured on server`, errorCode = null, data = null, httpStatusCode = 500) => {

    const objToSend = {
        status: `error`,
        message
    };

    if (errorCode) objToSend.code = errorCode;
    if (data) objToSend.data = data;

    return res.status(Number(httpStatusCode)).json(objToSend);
}