const mongoose = require("mongoose");
const {
    defaultStringConfig,
    defaultBooleanConfig,
    defaultObjectConfig
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
        userID:defaultStringConfig,

        redirectURI: defaultStringConfig
    },
    paymentCallback:defaultObjectConfig,
  
}, { timestamps: true });

module.exports = mongoose.model('outhState', outhStateSchema);