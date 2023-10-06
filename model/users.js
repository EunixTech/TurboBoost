const mongoose = require("mongoose");
const { defaultStringConfig,defaultObjectConfig } = require("../utils/mongoose");

const userSchema = new mongoose.Schema(
    {
        user_info: {
            first_name: defaultStringConfig,
            last_name: defaultStringConfig,
            password: defaultStringConfig,
            user_name: defaultStringConfig,
            email_address: defaultStringConfig,
            date_of_birth: defaultStringConfig,
        },

        user_basic_info: {
            bussiness_type:{
                type: Number,
                enum:[1,2,3]
            },
            country: defaultStringConfig,
            email_token: defaultStringConfig,
        },

        app_token: {
            shopify: defaultObjectConfig,
            wordpress: defaultStringConfig,
            woocomerce: defaultStringConfig,
        },
    },
    { timestamps: true }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("user", userSchema);
