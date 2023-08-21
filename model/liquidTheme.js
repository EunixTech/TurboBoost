const mongoose = require("mongoose"),
    { defaultStringConfig } = require("../../utils/mongoose");

const liquidThemeSchema = new mongoose.Schema({
        theme_id: {
            ...defaultStringConfig,
            required: true,
        },
        theme_content: {
            ...defaultStringConfig,
            required: true,
        },
        theme_graphql_api_id: {
            ...defaultStringConfig,
            required: true,
        },

    },{timestamps: true});

module.exports = mongoose.model("LiquidTheme", liquidThemeSchema);
