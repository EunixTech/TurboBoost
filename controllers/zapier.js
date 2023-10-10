const {
    sendSuccessJSONResponse,
    sendFailureJSONResponse,
} = require("../handlers/jsonResponseHandlers")



async function connectZapier(req, res) {
    try {

        return sendSuccessJSONResponse(res, {
            success: true,
            message: `Zapier Connected`,
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
    connectZapier
}