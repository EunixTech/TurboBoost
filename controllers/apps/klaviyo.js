const {
    sendSuccessJSONResponse,
    sendFailureJSONResponse,
} = require("../../handlers/jsonResponseHandlers")



async function connectKlaviyo(req, res) {
    try {

        return sendSuccessJSONResponse(res, {
            success: true,
            message: `Klaviyo Connected`,
        });
    } catch (e) {
        console.log(e);
        return sendFailureJSONResponse(
            res,
            { message: 'something went wrong' },
            400)
    }

}


module.exports = {
    connectKlaviyo
}