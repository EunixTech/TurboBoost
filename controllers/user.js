const mongoose = require("mongoose");
const User = mongoose.model("user");
const sendEmail = require("../services/sendEmail");
const generateRandomString = require("../utils/generateRandomString");
const generateToken = require('../utils/generateToken.js');
const hashedPassword = require("../utils/hashPassword");
const {
    sendSuccessJSONResponse,
    sendFailureJSONResponse,
    sendErrorJSONResponse,
} = require("../handlers/jsonResponseHandlers.js");

const {
    isTruthyString,
    isValidEmailAddress,
    isValidPassword
} = require('../utils/verifications.js');


exports.loginWithEmail = async (req, res, next) => {
    try {

        const { email_address, password } = req.body;

        if (!(email_address || password)) return sendFailureJSONResponse(res, { message: "Please provide email address and password" });

        if (!email_address) return sendFailureJSONResponse(res, { message: "Please provide email address" });
        else if (email_address && !isValidEmailAddress(email_address)) return sendFailureJSONResponse(res, { message: "Please provide valid email address" });

        if (!password) return sendFailureJSONResponse(res, { message: "Please provide password" });
        else if (password || !isValidPassword(password)) return sendFailureJSONResponse(res, { message: "password should include at least one upper case, one lower case,one digit & special character" });

        const user = await User.findOne({ email });

        User.findOne({
            "user_info.email_address": email_address
        }).then(async (foundUser) => {
            if (foundUser && (await user.matchPassword(password))) {
                return sendSuccessJSONResponse(res, {
                    id: foundUser._id,
                    name: foundUser?.user_info?.first_name,
                    email_address: foundUser.user_info?.user_info?.email_address,
                })
            } else {
                return sendFailureJSONResponse(res, { message: "Invalid email or password" });
            }
        })

    } catch (error) {
        return sendFailureJSONResponse(res, { message: "Something went wrong" });
    }
}

exports.validateData = async (req, res, next) => {
    const {
        first_name,
        last_name,
        email_address,
        bussiness_type,
        country,
        password
    } = req.body;

    const missingData = [],
        invalidData = [];

    if (!isTruthyString(first_name)) missingData.push("First name");
    if (!isTruthyString(last_name)) missingData.push("Last name");
    if (!bussiness_type) missingData.push("Bussiness type");
    else if (bussiness_type && isNaN(bussiness_type)) invalidData("Bussiness type")
    if (!isTruthyString(country)) missingData.push("Country");

    if (!email_address) missingData.push("Email Address");
    else if (!isValidEmailAddress(email_address)) invalidData.push("Email Address");

    if (!password) missingData.push("password");
    else if (!isValidPassword(password)) invalidData.push("password");

    if (missingData.length || invalidData.length) {
        if (missingData.length) return sendFailureJSONResponse(res, { message: `Missing Data:- ${missingData.join(`, `)}` });
        if (invalidData.length) return sendFailureJSONResponse(res, { message: `Invalid Data:- ${invalidData.join(`, `)}` });

    } else {

        const formData = {
            user_info: {},
            user_basic_info: {}
        };

        if (first_name) formData.user_info.first_name = first_name;
        if (last_name) formData.user_info.last_name = last_name;
        if (email_address) formData.user_info.email_address = email_address;
        if (bussiness_type) formData.user_basic_info.bussiness_type = bussiness_type;
        if (country) formData.user_basic_info.country = country;
        if (password) formData.user_info.password = await hashedPassword(password);

        req.formData = formData
        next();
    }

}

exports.fetchAccount = (req, res, next) => {
    const userId = req.userId;

    User.findById(userId)
        .then((user) => {
            ''
            if (!user) return sendFailureJSONResponse(res, { message: "Account not found" });
            else {
                return sendSuccessJSONResponse(res, { acccount: user });
            }
        }).catch((err) => {
            console.log(err)
            return sendFailureJSONResponse(res, { message: "Something went wrong" });
        })
}


exports.registerAccount = async (req, res, next) => {
    try {

        const emailAddress = req.body.email_address;

        const foundUser = await User.findOne({ "user_info.email_address": emailAddress });

        if (foundUser) return sendFailureJSONResponse(res, { message: "Account already exists" }, 403);
        else {

            User.create(req.formData)
                .then((newAccount) => {
                    if (!newAccount) {

                        return sendFailureJSONResponse(res, { message: "Something went wrong" });
                    } else {
                        console.log(`newAccount`, newAccount._id)
                        generateToken(res, newAccount._id);
                        return sendSuccessJSONResponse(res, { message: "Account created successfully" });
                    }
                }).catch((err) => {
                    console.log(err)
                    return sendFailureJSONResponse(res, { message: "Something went wrong" });
                });
        }

    } catch (error) {
        console.log(error)
        return sendFailureJSONResponse(res, { message: "Something went wrong" });
    }

};

exports.updateAccount = async (req, res, next) => {

    const userId = req.params.userId;
    const emailAddress = req.body.email_address;

    if (!userId) { sendFailureJSONResponse(res, { message: "Something went wrong" }) }

    const accountExists = await User.findOne({ "user_info.email_address": emailAddress, _id: { $ne: userId } });
    if (accountExists) {
        return sendFailureJSONResponse(res, { message: "Account already exists" }, 403);
    } else {
        User.findByIdAndUpdate({ _id: userId }, req.formData, { new: true })
            .then((updateAccount) => {
                if (!updateAccount) return sendFailureJSONResponse(res, { message: "Something went wrong" });
                else sendSuccessJSONResponse(res, { message: "Account updated successfully" })
            }).catch((err) => {
                return sendErrorJSONResponse(res, { message: "Something went wrong" });
            })
    }

}


exports.deleteAccount = async (req, res, next) => {

    const userId = req.query.userId;
    if (!userId) { return sendFailureJSONResponse(res, { message: "Something went wrong" }) };

    User.findByIdAndDelete({ _id: userId })
        .then((acccount) => {
            if (!acccount) {
                return sendFailureJSONResponse(res, { message: "Something went wrong" })
            }
            else {
                return sendSuccessJSONResponse(res, { message: "Account deleted successfully" })
            }
        }).catch((err) => {
            return sendErrorJSONResponse(res, { message: "Something went wrong" });
        })

}

exports.checkAccountExist = async (req, res, next) => {

    const emailAddress = req.body.email_address;
    console.log(`emailAddress`, emailAddress)

    if (!emailAddress) return sendFailureJSONResponse(res, { message: "Please provide email address" });
    else if (!isValidEmailAddress(emailAddress)) return sendFailureJSONResponse(res, { message: "Please provide valid email address" });

    User.findOne({ "user_info.email_address": emailAddress })
        .then((foundAccount) => {
            if (!foundAccount) return sendFailureJSONResponse(res, { message: "Account not exist" });
            else {
                User.findByIdAndUpdate({ _id: "6520095c29371858a78fb1ec" }, {
                    email_token: generateRandomString(10)
                })
                sendEmail(reciverEmail = emailAddress, HTMlContent = "<h1></h1>", heading = "forgetpassword")
                sendSuccessJSONResponse(res, { message: " " });
            }
        }).catch((err) => {
            console.log(err)
            return sendFailureJSONResponse(res, { message: "Something went wrong" });
        })

}

exports.updatePassword = async (req, res, next) => {

    const {
        password,
        userId
    } = req.body;

    if (!(password || userId)) return sendFailureJSONResponse(res, { message: "Please provide password and userId" });

    User.findByIdAndUpdate({ _id: userId }, {
        "user_info.password": password
    }, { new: true })
        .then((updatedAccount) => {
            if (!foundAccount) return sendFailureJSONResponse(res, { message: "Something went wrong" });
            else sendSuccessJSONResponse(res, { message: "Password updated successfully" });
        })
        .catch((err) => {
            return sendFailureJSONResponse(res, { message: "Please provide email address" });
        })

}



exports.logout = async (req, res, next) => {

    const deviceType = req?.body?.device_type;
    const deviceToken = req?.body?.device_token;

    if (!isValidString(deviceToken?.trim())) return failureJSONResponse(res, { message: 'Device token missing.' });


    if (!deviceType) {
        return failureJSONResponse(res, { message: 'Device type missing.' });
    } else if (isNaN(deviceType)) {
        return failureJSONResponse(res, { message: 'Invalid device type.' });
    }

    try {
        const user = await User.updateOne(
            { _id: req.userId },
            {
                $pull: {
                    user_device_info: {
                        token: deviceToken,
                        device_type: Number(deviceType),
                    },
                },
            }
        );

        if (user.modifiedCount === 1) {
            return successJSONResponse(res, { message: 'Logout successful.' });
        } else {
            return failureJSONResponse(res, { message: 'Device token not found.' });
        }
    } catch (error) {
        return failureJSONResponse(res, { message: 'Something went wrong.' });
    }
}
