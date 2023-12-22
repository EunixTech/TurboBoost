const mongoose = require("mongoose");
const { defaultStringConfig } = require("../utils/mongoose");

const OTPSchema = new mongoose.Schema({

    is_active: {
        type: Boolean,
        required: true,
        default: true
    },

    code: {
        ...defaultStringConfig,
        required: true
    },

    email_address: {
        ...defaultStringConfig,
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `user`,
        required: true
    },

}, { timestamps: true });

module.exports = mongoose.model('otp', OTPSchema);

