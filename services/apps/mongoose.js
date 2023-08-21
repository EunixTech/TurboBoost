const {
    sendSuccessJSONResponse,
    sendFailureJSONResponse,
} = require("../../handlers/jsonResponseHandlers");


class MongooseAPI {

    /**
     * @param {Error} e - The error object.
     * @param {Object} res - The response object.
     * @returns {Object} The failure JSON response.
     */
    handleError(e, res) {
        console.error(e);
        return sendFailureJSONResponse(res, { message: e.message });
    }

    /**
     * @param {Object} model - The Mongoose model.
     * @param {Object} dataObj - The data object for the new document.
     * @param {Object} res - The response object.
     */
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

    /**
     * @param {Object} model - The Mongoose model.
     * @param {Object} queryObj - The query object for finding the document.
     * @param {Object} res - The response object.
     */
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

    /**
     * @param {Object} queryObj - The query object for finding the document.
     * @param {Object} updateObj - The update object for the document.
     * @param {Object} res - The response object.
     */
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

    /**
     * @param {Object} model - The Mongoose model.
     * @param {Object} queryObj - The query object for finding the document.
     * @param {Object} res - The response object.
     */
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
