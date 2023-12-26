const mongoose = require("mongoose");
const {fetchPageSpeedAPIdata} =  require("../../services/fetchPageSpeedAPIdata")

const {
    sendSuccessJSONResponse,
    sendFailureJSONResponse,
    sendErrorJSONResponse,
} = require("../../handlers/jsonResponseHandlers.js");

exports.fetchGoogleSpeedAPIData = async (req, res, next) => {
    
    try {
        const websiteURL = req.query.url;
       const data = await fetchPageSpeedAPIdata(websiteURL);
       console.log("data",data)
        return sendSuccessJSONResponse(res, { message:"successfull",data });
    } catch (error) {
        return sendErrorJSONResponse(res, { message: "Error fetching data" });
    }

}

