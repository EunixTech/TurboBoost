const {
    sendSuccessJSONResponse,
    sendFailureJSONResponse,
} = require("../../handlers/jsonResponseHandlers");

class MongooseAPI {
   
    async createOperation(model, dataObj, res ) {
        try {
            const createdItem = await model.create(dataObj);

            if (!createdItem) { 
                return sendFailureJSONResponse(res, { message: "Failed to create item" });
            } else {
                return sendSuccessJSONResponse(res, {
                    message: "Item created successfully",
                    status: 201,
                    data: createdItem
                });
            }
        } catch (e) {
            console.error(e); // Log the error for debugging
            return sendFailureJSONResponse(res, { message: e.message });
        }

    }

    async readOperation(model, queryObj, res) {
        try {
            const item = await model.find(queryObj);
            return sendSuccessJSONResponse(res, { data: item });
        } catch (e) {
            console.error(e);
            return sendFailureJSONResponse(res, { message: e.message });
        }
    }

    async updateOperation(model, queryObj, updateObj, res) {
        try {
            const updatedItem = await model.findOneAndUpdate(queryObj, updateObj, { new: true });
            return sendSuccessJSONResponse(res, { data: updatedItem });
        } catch (e) {
            console.error(e);
            return sendFailureJSONResponse(res, { message: e.message });
        }
    }

    async deleteOperation(model, queryObj, res) {
        try {
            await model.findOneAndDelete(queryObj);
            return sendSuccessJSONResponse(res, { message: "Item deleted successfully" });
        } catch (e) {
            console.error(e);
            return sendFailureJSONResponse(res, { message: e.message });
        }
    }

    
}

module.exports = MongooseAPI;