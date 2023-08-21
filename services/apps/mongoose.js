const {
    sendSuccessJSONResponse,
    sendFailureJSONResponse,
} = require("../handlers/jsonResponseHandlers");

class MongooseAPI {
    constructor({ Model, dataObj, res }) {
        if (!(Model && dataObj && res)) {
            throw new Error("Cannot initialize MongooseAPI. Required parameters missing");
        }
        this.Model = Model;
        this.dataObj = dataObj;
        this.res = res;
    }

    async createOperation() {
        try {
            const createdItem = await this.Model.create(this.dataObj);

            if (!createdItem) {
                return sendFailureJSONResponse(this.res, { message: "Something went wrong" });
            } else {
                return sendSuccessJSONResponse(this.res, {
                    message: "Item created successfully",
                    status: 201,
                    data: createdItem
                });
            }
        } catch (e) {
            return sendFailureJSONResponse(this.res, { message: "Something went wrong" });
        }
    }
}

module.exports = MongooseAPI;