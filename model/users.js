const mongoose = require("mongoose");
const {
    defaultStringConfig,
} = require("../utils/mongoose");

const userSchema = new mongoose.Schema({

    user_info :{
        first_name: defaultStringConfig,
        last_name: defaultStringConfig,
        password : defaultStringConfig,
        user_name: defaultStringConfig,
        email_address: defaultStringConfig,
        date_of_birth : defaultStringConfig
    },

    app_token:{
        shopify: defaultStringConfig,
        wordpress: defaultStringConfig,
        woocomerce: defaultStringConfig
    }

}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);