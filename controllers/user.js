const asyncHandler = require('express-async-handler');
const mongoose = require("mongoose");
const User = mongoose.model("user");
const OauthState = mongoose.model("outhState")
const sendEmail = require("../services/sendEmail");
const generateRandomString = require("../utils/generateRandomString");
const generateToken = require('../utils/generateToken.js');
const {
    sendSuccessJSONResponse,
    sendFailureJSONResponse,
    sendErrorJSONResponse,
} = require("../handlers/jsonResponseHandlers.js");

const {
    isTruthyString,
    isValidEmailAddress,
} = require('../utils/verifications.js');


// Auth user & get token
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } else {
        throw new Error('Invalid email or password');
    }
});

exports.validateData = (req, res, next) => {
    const {
        first_name,
        last_name,
        email_address,
        bussiness_name,
        country,
        password
    } = req.body;

    const missingData = [],
        invalidData = [];

    if (!isTruthyString(first_name)) missingData.push("First name");
    if (!isTruthyString(last_name)) missingData.push("Last name");
    if (!isTruthyString(bussiness_name)) missingData.push("Bussiness name");
    if (!isTruthyString(country)) missingData.push("Country");

    if (!email_address) missingData.push("Email Address");
    else if (!isValidEmailAddress(email_address)) invalidData.push("Email Address");

    if (!password) missingData.push("password");
    else if (!isValidPassword(password)) invalidData.push("password");

    if (missingData.length || invalidData.length) {
        if (missingData.length) toast.error(`Missing Data:- ${missingData.join(`, `)}`);
        if (invalidData.length) toast.error(`Invalid Data:- ${invalidData.join(`, `)}`);
        return;
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
        if (password) formData.user_info.password = password;

        req.formData = formData
    }

}

exports.fetchAccount = (req, res, next) => {
    const userId = req.userId;

    User.findById(userId)
        .then((user) => {
            if (!user) return sendFailureJSONResponse(res, { message: "Account not found" });
            else {
                return sendSuccessJSONResponse(res, { acccount: user });
            }
        }).catch((err) => {
            return sendFailureJSONResponse(res, { message: "Something went wrong" });
        })
}


exports.registerAccount = async (req, res, next) => {
    try {

        const emailAddress = req.body.email_address;

        const foundUser = await User.findOne({ "user_info.email_address": emailAddress });

        if (foundUser)  return sendFailureJSONResponse(res, { message: "Account already exists" }, 403);
        else {

            User.create(req.formData)
                .then((newAccount) => {
                    if (!newAccount) {
                        return sendFailureJSONResponse(res, { message: "Something went wrong" });
                    } else {
                        generateToken(res, newAccount._id);
                        return sendSuccessJSONResponse(res, { message: "Account created successfully" });
                    }
                }).catch((err) => {
                    return sendFailureJSONResponse(res, { message: "Something went wrong" });
                });
        }

    } catch (error) {
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
    if (!userId) { sendFailureJSONResponse(res, { message: "Something went wrong" }) };

    User.findByIdAndDelete({ _id: userId }).then((acccount) => {
        if (!acccount) return sendFailureJSONResponse(res, { message: "Something went wrong" })
        else return sendSuccessJSONResponse(res, { message: "Account deleted successfully" })
    }).catch((err) => {
        return sendErrorJSONResponse(res, { message: "Something went wrong" });
    })

}

exports.checkAccountExist = async(req, res, next) => {

    const emailAddress = req.body.email_address;

    if (!emailAddress) return sendFailureJSONResponse(res, { message: "Please provide email address" });
    else if (!isValidEmailAddress(emailAddress)) return sendFailureJSONResponse(res, { message: "Please provide valid email address" });

    User.findOne({ "user_info.email_address": emailAddress })
        .then((foundAccount) => {
            if (!foundAccount) return sendFailureJSONResponse(res, { message: "Account not exist" });
            else {
              User.findByIdAndUpdate({_id: userId},{
                email_token :generateRandomString(10)
              })
              sendSuccessJSONResponse(res, { message: " " });
            }
        }).catch((err) => {
            return sendFailureJSONResponse(res, { message: "Please provide email address" });
        })

}

exports.updatePassword = async(req, res, next) =>{

    const {
        password,
        userId
    } = req.body;

    if (!(password || userId)) return sendFailureJSONResponse(res, { message: "Please provide password and userId" });

    User.findByIdAndUpdate({_id: userId },{
        "user_info.password": password
    }, {new: true})
    .then((updatedAccount)=>{
        if (!foundAccount) return sendFailureJSONResponse(res, { message: "Something went wrong" });
        else sendSuccessJSONResponse(res, { message: "Password updated successfully" });
    })
    .catch((err)=>{
        return sendFailureJSONResponse(res, { message: "Please provide email address" });
    })

}

exports.loginUsingStateToken=async(req,res,next)=>{
    try{
        let userToken=req.params.userToken
        if(!userToken){
            return sendFailureJSONResponse(res, { message: "Please provide token" });
        }
        let stateData=await OauthState.findOne({unique_key:userToken})
        console.log(Object.keys(stateData).length===0)

        if(Object.keys(stateData).length===0){
            return sendFailureJSONResponse(res, { message: "Invalid Token" });
        }
        let data=stateData?.data

        if(!data?.userID){
            return sendFailureJSONResponse(res, { message: "userId not found" });
        }
        const user = await User.findById(data.userID);
        console.log(user)
        await OauthState.deleteOne({ _id: stateData._id });
        if (user) {
            generateToken(res, user._id);
            res.json({
                _id: user._id,
                userData: user.user_info,
            });
        } else {
            throw new Error('Invalid email or password');
        }

    }catch(e){
        console.log(e)
        return sendFailureJSONResponse(res, { message: "Invalid Token" });
    }
}


// Logout user / clear cookie
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};
