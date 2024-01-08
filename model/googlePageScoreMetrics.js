const mongoose = require("mongoose"),
    { defaultStringConfig, defaultNumberConfig } = require("../utils/mongoose");

const googlePageScoreMetricsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `user`,
        required: true
    },
    websiteURL: {
        ...defaultStringConfig,
        required: true
    },
    mobile:
    {
        before: {
            first_contentful_paint: defaultNumberConfig,
            largest_contentful_paint: defaultNumberConfig,
            total_blocking_time: defaultNumberConfig,
            first_input_delay: defaultNumberConfig,
            page_load_time: defaultNumberConfig,
            performence: defaultNumberConfig,
            cumulative_layout_shift: defaultNumberConfig,
            interaction_next_paint: defaultNumberConfig,
            time_first_byte: defaultNumberConfig,
            google_speed_index: defaultNumberConfig,
            time_to_interact: defaultNumberConfig,
            screenshot_thumbnails: [],
            final_screenshot: {},

            average_order_value: defaultNumberConfig,
            conversion_rate: defaultNumberConfig,
            average_order_value: defaultNumberConfig,
        },
        after: {
            first_contentful_paint: defaultNumberConfig,
            largest_contentful_paint: defaultNumberConfig,
            total_blocking_time: defaultNumberConfig,
            first_input_delay: defaultNumberConfig,
            page_load_time: defaultNumberConfig,
            performence: defaultNumberConfig,
            cumulative_layout_shift: defaultNumberConfig,
            interaction_next_paint: defaultNumberConfig,
            time_first_byte: defaultNumberConfig,
            google_speed_index: defaultNumberConfig,
            time_to_interact: defaultNumberConfig,
            screenshot_thumbnails: [],
            final_screenshot: {},

            average_order_value: defaultNumberConfig,
            conversion_rate: defaultNumberConfig,
            average_order_value: defaultNumberConfig,
        },
    },
    desktop: {
        before: {

            first_contentful_paint: defaultNumberConfig,
            largest_contentful_paint: defaultNumberConfig,
            total_blocking_time: defaultNumberConfig,
            first_input_delay: defaultNumberConfig,
            page_load_time: defaultNumberConfig,
            performence: defaultNumberConfig,
            cumulative_layout_shift: defaultNumberConfig,
            interaction_next_paint: defaultNumberConfig,
            time_first_byte: defaultNumberConfig,
            google_speed_index: defaultNumberConfig,
            time_to_interact: defaultNumberConfig,
            screenshot_thumbnails: [],
            final_screenshot: {},

            revenue_per_session: defaultNumberConfig,
            add_to_cart_inc: defaultNumberConfig,
            lower_bounce_rate: defaultNumberConfig,
        },

        after: {
            first_contentful_paint: defaultNumberConfig,
            largest_contentful_paint: defaultNumberConfig,
            total_blocking_time: defaultNumberConfig,
            first_input_delay: defaultNumberConfig,
            page_load_time: defaultNumberConfig,
            performence: defaultNumberConfig,
            cumulative_layout_shift: defaultNumberConfig,
            interaction_next_paint: defaultNumberConfig,
            time_first_byte: defaultNumberConfig,
            google_speed_index: defaultNumberConfig,
            time_to_interact: defaultNumberConfig,
            screenshot_thumbnails: [],
            final_screenshot: {},

            revenue_per_session: defaultNumberConfig,
            add_to_cart_inc: defaultNumberConfig,
            lower_bounce_rate: defaultNumberConfig,
        },

    }

}, { timestamps: true });

module.exports = mongoose.model("GooglePageScoreMetrics", googlePageScoreMetricsSchema);
