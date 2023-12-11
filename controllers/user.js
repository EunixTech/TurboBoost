const mongoose = require("mongoose");
const User = mongoose.model("user");
const OTP = mongoose.model("otp");
const OauthState = mongoose.model("outhState")
const sendEmail = require("../services/sendEmail");
const generateRandomString = require("../utils/generateRandomString");
const generateToken = require('../utils/generateToken.js');
const hashedPassword = require("../utils/hashPassword");
const { createMixpanelEvent } = require("../services/mixepanelEventFunc");
const { generateOTP } = require("../utils/generateOTP.js");
const bcrypt = require("bcrypt");

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
        else if (password && !isValidPassword(password)) return sendFailureJSONResponse(res, { message: "password should include at least one upper case, one lower case,one digit & special character" });

        User.findOne({
            "user_info.email_address": email_address
        }).then(async (foundUser) => {
            await createMixpanelEvent("loginwith email", {
                firstName: "manmohan",
                id: 2,
                email_address: "manmohankuma@exunix.com"
            })
            if (!foundUser) return sendFailureJSONResponse(res, { message: `Account does't exist with email ${email_address}` });
            else if (foundUser && (await foundUser.matchPassword(password))) {
                return sendSuccessJSONResponse(res, {
                    token: generateToken(res, foundUser._id),
                    id: foundUser._id,
                    first_name: foundUser?.user_info?.first_name,
                    email_address: foundUser.user_info?.user_info?.email_address,
                })
            } else {
                return sendFailureJSONResponse(res, { message: "Invalid email or password" });
            }
        })

    } catch (error) {
        console.log(error)
        return sendFailureJSONResponse(res, { message: "Something went wrong" });
    }

}

// Standard signup with Google.
exports.loginWithGoogle = async (req, res, next) => {

    const email_address = req?.body?.email_address,
        first_name = req?.body?.first_name,
        google_id = req?.body?.google_id,
        google_token = req?.body?.google_token,
        device_token = req?.body?.device_token;

    // if (!isValidString(first_name.trim()))
    //     return failureJSONResponse(res, { message: `Please enter valid first_name` });
    // if (!isValidString(google_id.trim()))
    //     return failureJSONResponse(res, { message: `google id missing` });
    // if (!isValidString(google_token.trim()))
    //     return failureJSONResponse(res, { message: `google token missing` });

    // if (!isValidString(device_token.trim()))
    //     return failureJSONResponse(res, { message: `device token missing` });

    // if (!isValidString(email_address.trim()))
    //     return failureJSONResponse(res, {
    //         message: `Please enter email address`,
    //     });
    // else 

    if (email_address.trim() && !isValidEmailAddress(email_address.trim()))
        return failureJSONResponse(res, {
            message: `Please enter valid email address`,
        });

    // Check If email is register with any user via other platforms like facebook,google or email.

    const foundUser = await User.findOne({
        "google_info.google_id": google_id
    });


    if (foundUser && Object.keys(foundUser).length) {

        const updateDeviceInfo = await User.findOneAndUpdate(
            { _id: foundUser._id },
            {
                $addToSet: {
                    device_token: device_token
                },
                $set: {
                    "user_info.status": Number(2),
                },
            },
            { new: true }
        );

        if (!updateDeviceInfo) failureJSONResponse(res, { message: `Something went wrong`, });
        else {

            return sendSuccessJSONResponse(res, {
                token: generateToken(res, checkUserExistWithEmail._id),
                userId: foundUser._id,
                first_name: foundUser?.user_info?.first_name || null,
                message: `success`,
            });

        }
    } else {
        const checkUserExistWithEmail = await User.findOne(
            {
                "user_info.email_address": email_address.toLowerCase(),
                "google_info.google_id": null,
                "user_info.status": 1,
            },
            {
                user_basic_info: 1,
                _id: 1,
                userStatus: 1,
                user_info: 1,
            }
        );

        if (
            checkUserExistWithEmail &&
            Object.keys(checkUserExistWithEmail).length
        ) {

            const updateDeviceInfo = await User.findOneAndUpdate(
                { _id: checkUserExistWithEmail._id },
                {
                    $set: {
                        "google_info.google_id": google_id,
                        "google_info.google_email": email_address.toLowerCase(),
                        "google_info.google_token": google_token,
                        "user_info.source": 2,
                        device_token: device_token
                    }
                },
                { new: true }
            );

            return successJSONResponse(res, {
                status: 200,
                data: {
                    userId: checkUserExistWithEmail._id,
                    first_name: checkUserExistWithEmail.user_info.first_name || null,

                },
                message: `success`,
                token: generateToken(res, checkUserExistWithEmail._id),
            });
        } else {

            // Create a new user.
            var newUser = {};

            var google_info = {
                google_id: google_id,
                google_email: email_address.toLowerCase(),
                google_token: google_token,
            };
            var user_info = {
                first_name: first_name,
                status: Number(2),
                device_token,

                email_address: email_address.toLowerCase(),
            };


            newUser.google_info = google_info;
            newUser.user_info = user_info;
            newUser.user_basic_info = {
                source: 2,
            }

            User.create(newUser)
                .then((data) => {
                    if (!data) return sendFailureJSONResponse(res, { message: "Something went wrong" });
                    else {
                        const token = generateToken(res, data?._id);
                        return sendSuccessJSONResponse(res, {
                            token,
                            userId: data._id,
                            first_name: data.user_info.first_name || null,
                            message: `success`,
                        }, 201);

                    }
                })

        }

    }

}

exports.validateData = async (req, res, next) => {
    const {
        first_name,
        last_name,
        email_address,
        bussiness_type,
        country,
        password,
        source
    } = req.body;

    const missingData = [],
        invalidData = [];

    if (!isTruthyString(first_name)) missingData.push("First first_name");
    if (!isTruthyString(last_name)) missingData.push("Last first_name");
    if (!bussiness_type) missingData.push("Bussiness type");
    // else if (bussiness_type && isNaN(bussiness_type)) invalidData("Bussiness type")
    // if (!isTruthyString(country)) missingData.push("Country");

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
        if (first_name) formData.user_basic_info.source = Number(1);
        if (last_name) formData.user_info.last_name = last_name;
        if (email_address) formData.user_info.email_address = email_address;
        if (bussiness_type) formData.user_basic_info.bussiness_type = 1;
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

        const email_address = req.body.email_address;

        const foundUser = await User.findOne({ "user_info.email_address": email_address });

        if (foundUser) {
            if (foundUser?.user_basic_info?.source === 2) {
                return sendFailureJSONResponse(res, { message: "Google account already exists with this email" });
            }
            else if (foundUser?.user_basic_info?.source === 1) {
                return sendFailureJSONResponse(res, { message: "Account aready exist with this email" });
            }

        } else {

            User.create(req.formData)
                .then((newAccount) => {
                    if (!newAccount) {

                        return sendFailureJSONResponse(res, { message: "Something went wrong" });
                    } else {
                        return sendSuccessJSONResponse(res,
                            {
                                message: "Account created successfully",
                                data: req.body
                            }, 201);
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
    const email_address = req.body.email_address;

    if (!userId) { sendFailureJSONResponse(res, { message: "Something went wrong" }) }

    const accountExists = await User.findOne({ "user_info.email_address": email_address, _id: { $ne: userId } });
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

    const userID = req.userId;
    const email_address = req.body.email_address;

    if (!email_address) return sendFailureJSONResponse(res, { message: "Please provide email address" });
    else if (!isValidEmailAddress(email_address)) return sendFailureJSONResponse(res, { message: "Please provide valid email address" });

    User.findOne({ "user_info.email_address": email_address })
        .then((foundAccount) => {
            if (!foundAccount) return sendFailureJSONResponse(res, { message: "Account not exist" });
            else {
                User.findByIdAndUpdate({ _id: userID }, {
                    email_token: generateRandomString(10)
                })
                sendEmail(reciverEmail = email_address, HTMlContent = "<h1></h1>", heading = "forgetpassword")
                return sendSuccessJSONResponse(res, { message: "Email Sent successfully" });
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

exports.loginUsingStateToken = async (req, res, next) => {
    try {
        let userToken = req.params.userToken
        if (!userToken) {
            return sendFailureJSONResponse(res, { message: "Please provide token" });
        }
        let stateData = await OauthState.findOne({ unique_key: userToken })

        if (Object.keys(stateData).length === 0) {
            return sendFailureJSONResponse(res, { message: "Invalid Token" });
        }
        let data = stateData?.data

        if (!data?.userID) {
            return sendFailureJSONResponse(res, { message: "userId not found" });
        }
        const user = await User.findById(data.userID);

        await OauthState.deleteOne({ _id: stateData._id });
        if (user) {

            generateToken(res, user._id);
            res.json({
                _id: user._id,
                userData: user.user_info,
                redirectURI: data?.redirectURI
            });
        } else {
            throw new Error('Invalid email or password');
        }

    } catch (e) {
        return sendFailureJSONResponse(res, { message: "Invalid Token" });
    }
}


exports.logout = async (req, res, next) => {

    const device_token = req?.body?.device_token;

    if (!isValidString(device_token?.trim())) return failureJSONResponse(res, { message: 'Device token missing.' });

    try {
        const user = await User.updateOne(
            { _id: req.userId },
            {
                $pull: {
                    device_token: device_token
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

exports.sendingOTPForChangeEmail = (req, res, next) => {

    const userId = req?.userId,
        email_address = req?.body?.email_address;

    if (!email_address) return sendFailureJSONResponse(res, { message: "Please provide email address" });

    User.findById({ _id: userId })
        .then((foundUser) => {
            if (!foundUser) return sendFailureJSONResponse(res, { message: "Something went wrong" });
            else {
                const OTPDataObj = {
                    is_active: true,
                    code: generateOTP(),
                    email_address,
                    user: userId
                }

                OTP.create(OTPDataObj)
                    .then((newOTP) => {
                        if (!newOTP) return sendFailureJSONResponse(res, { message: "Something went wrong" });
                        else {
                            sendEmail(reciverEmail = email_address, HTMlContent = "<h1>" + generateOTP() + "</h1>", heading = "Change Email Address");
                            return sendSuccessJSONResponse(res, { message: "Email sent successfully" })
                        }
                    }).catch((err) => {
                        return sendFailureJSONResponse(res, { message: "Something went wrong" });
                    })
            }
        }).catch((err) => {
            return sendFailureJSONResponse(res, { message: "Something went wrong" });
        })

}

exports.checkEmailAreadyExits = (req, res, next) => {

    const userId = req.userId,
        email_address = req?.body?.email_address;

    if (!email_address) { sendFailureJSONResponse(res, { message: "Please provide email address" }) };

    User.findOne({ "user_info.email_address": email_address, _id: { $ne: userId } })
        .then((foundUser) => {
            if (foundUser) return sendFailureJSONResponse(res, { message: `Account with ${email_address} already exits` });
            else return next();
        }).catch((err) => {
            console.log(err)
            return sendFailureJSONResponse(res, { message: "Something went wrong" });
        })

}

exports.updateEmailAddress = (req, res, next) => {

    const userId = req?.userId,
        OTPCode = req.body.OTPCode,
        email_address = req?.body?.email_address;

    if (!email_address) return sendFailureJSONResponse(res, { message: "Please provide email address" });
    if (!OTPCode) return sendFailureJSONResponse(res, { message: "Please provide otp" });

    OTP.findOne({
        is_active: true,
        user: userId,
        code: OTPCode,
        email_address
    })
        .then((foundOTP) => {
            if (!foundOTP) return sendFailureJSONResponse(res, { message: "Invalid OTP" });
            else {

                User.findByIdAndUpdate({ _id: userId }, {
                    "user_info.email_address": email_address
                }, { new: true })
                    .then(async (updatedAccount) => {
                        if (!updatedAccount) return sendFailureJSONResponse(res, { message: "Something went wrong" });
                        else {
                            await OTP.findByIdAndDelete({ _id: foundOTP._id });
                            return sendSuccessJSONResponse(res, { message: "Email updated successfully" });
                        }
                    })
                    .catch((err) => {
                        return sendFailureJSONResponse(res, { message: "Please provide email address" });
                    }).catch((err) => {
                        return sendFailureJSONResponse(res, { message: "Something went wrong" });
                    })
            }
        }).catch((err) => {
            return sendFailureJSONResponse(res, { message: "Something went wrong" });
        })


}
