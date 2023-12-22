const mongoose = require("mongoose");
const {fetchPageSpeedAPIdata} =  require("../../services/fetchPageSpeedAPIdata")

const {
    sendSuccessJSONResponse,
    sendFailureJSONResponse,
    sendErrorJSONResponse,
} = require("../../handlers/jsonResponseHandlers.js");

exports.fetchGoogleSpeedAPIData = async (req, res, next) => {
    
    try {
       const data = await fetchPageSpeedAPIdata("https://menehariya.netscapelabs.com");
       console.log("data",data)
        return sendSuccessJSONResponse(res, { message:"successfull",data });
    } catch (error) {
        return sendErrorJSONResponse(res, { message: "Error fetching data" });
    }

}

