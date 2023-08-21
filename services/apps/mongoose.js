const {
    sendSuccessJSONResponse,
    sendFailureJSONResponse,
} = require("../../handlers/jsonResponseHandlers");

class MongooseAPI {
    
    async handleError(e, res) {
        console.error(e);
        return sendFailureJSONResponse(res, { message: e.message });
    }

    async createOperation(model, dataObj, res) {
        try {
            const createdItem = await model.create(dataObj);
            if (!createdItem) {
                return sendFailureJSONResponse(res, { message: "Failed to create item" });
            }
            return sendSuccessJSONResponse(res, {
                message: "Item created successfully",
                status: 201,
                data: createdItem
            });
        } catch (e) {
            return this.handleError(e, res);
        }
    }

    async readOperation(model, queryObj, res) {
        try {
            const item = await model.findOne(queryObj);
            if (!item) {
                return sendFailureJSONResponse(res, { message: "Item not found" });
            }
            return sendSuccessJSONResponse(res, { data: item });
        } catch (e) {
            return this.handleError(e, res);
        }
    }

    async updateOperation(model, queryObj, updateObj, res) {
        try {
            const updatedItem = await model.findOneAndUpdate(queryObj, updateObj, { new: true });
            if (!updatedItem) {
                return sendFailureJSONResponse(res, { message: "Failed to update item" });
            }
            return sendSuccessJSONResponse(res, { data: updatedItem });
        } catch (e) {
            return this.handleError(e, res);
        }
    }

    async deleteOperation(model, queryObj, res) {
        try {
            const deletedItem = await model.findOneAndDelete(queryObj);
            if (!deletedItem) {
                return sendFailureJSONResponse(res, { message: "Failed to delete item" });
            }
            return sendSuccessJSONResponse(res, { message: "Item deleted successfully" });
        } catch (e) {
            return this.handleError(e, res);
        }
    }
}

module.exports = MongooseAPI;

module.exports = MongooseAPI;