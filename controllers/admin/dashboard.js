const mongoose = require("mongoose");
const {fetchPageSpeedAPIdata} =  require("../../services/fetchPageSpeedAPIdata")

const {
    sendSuccessJSONResponse,
    sendFailureJSONResponse,
    sendErrorJSONResponse,
} = require("../../handlers/jsonResponseHandlers.js");

exports.fetchGoogleSpeedAPIData = async (req, res, next) => {

    return res.json({
        data: await fetchPageSpeedAPIdata("https://menehariya.netscapelabs.com")
    })
}

