const mongoose = require("mongoose");
const { defaultStringConfig } = require("../utils/mongoose");

const productImageSchema = new mongoose.Schema({
    
    product_id: {
        ...defaultStringConfig,
        required: true
    },
    image_id: {
        ...defaultStringConfig,
        required: true
    },
    position:{
        ...defaultStringConfig,
        required: true
    },
    url: {
        ...defaultStringConfig,
        required: true
    },
    admin_graphql_api_id:{
        ...defaultStringConfig,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model('productImage', productImageSchema);