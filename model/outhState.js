const mongoose = require("mongoose");
const {
    defaultStringConfig,
    defaultBooleanConfig
} = require("../utils/mongoose");

const outhStateSchema = new mongoose.Schema({
    
    unique_key: {
        ...defaultStringConfig,
        required: true
    },
    data: {
        login: defaultBooleanConfig,
        hmac: {
            ...defaultStringConfig,
        },
        action:{
            ...defaultStringConfig,
        },
        userID:defaultStringConfig
    }

}, { timestamps: true });

module.exports = mongoose.model('outhState', outhStateSchema);