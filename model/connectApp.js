const mongoose = require("mongoose"),
    { defaultStringConfig } = require("../../utils/mongoose");

const connectAppSchema = new mongoose.Schema({
        app_name: {
            ...defaultStringConfig,
            required: true,
        },
        app_key: {
            ...defaultStringConfig,
            required: true,
        },
        connect_at : {
            type: Date,
            required: true
        }
        
    },{timestamps: true});

module.exports = mongoose.model("connectApp", connectAppSchema);
