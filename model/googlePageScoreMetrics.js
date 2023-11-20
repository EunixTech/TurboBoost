const mongoose = require("mongoose"),
    { defaultStringConfig, defaultNumberConfig } = require("../utils/mongoose");

const googlePageScoreMetricsSchema = new mongoose.Schema({
    core_vitals: {
        first_contentful_paint: {
            ...defaultNumberConfig,
            required: true
        },
        speed_index: {
            ...defaultNumberConfig,
            required: true
        },
        total_blocking_time: {
            ...defaultNumberConfig,
            required: true
        },
        largest_contentful_paint: {
            ...defaultNumberConfig,
            required: true
        },
    },
    performance: {
        performence: {
            ...defaultNumberConfig,
            required: true
        },
        accessibility: {
            ...defaultNumberConfig,
            required: true
        },
        best_practices: {
            ...defaultNumberConfig,
            required: true
        },
        seo: {
            ...defaultNumberConfig,
            required: true
        },

    },


}, { timestamps: true });

module.exports = mongoose.model("GooglePageScoreMetrics", googlePageScoreMetricsSchema);
