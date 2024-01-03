const mongoose = require("mongoose")
const User = mongoose.model("user")
const OauthState = mongoose.model("outhState")
const Subscription = mongoose.model("subscription")
const axios = require('axios')

const { planData } = require('../utils/constant')

const {
  sendSuccessJSONResponse,
  sendFailureJSONResponse,
  sendErrorJSONResponse,
} = require("../handlers/jsonResponseHandlers")

const { MODE,
  DEV_FRONTEND_URL,
  LIVE_FRONTEND_URL,
  LIVE_BACKEND_URL,
  DEV_BACKEND_URL,
  SHOPIFY_API_VERSION
} = process.env;

const FRONTEND_URL = MODE === 'dev' ? DEV_FRONTEND_URL : LIVE_FRONTEND_URL
const BACKEND_URL = MODE === 'dev' ? DEV_BACKEND_URL : LIVE_BACKEND_URL

const { v4: uuidv4 } = require('uuid');

exports.createSubscription = async (req, res, next) => {
  try {
    //   const { id: userId } = auth_body;

    const userId = req.userId;

    const { planType, planName } = req.body;

    let userData = await User.findById(userId)

    if (typeof userData?.app_token?.shopify?.isDeleted === 'undefined' || userData?.app_token?.shopify?.isDeleted) {
      return sendFailureJSONResponse(
        res,
        { message: "connect Shopify" },
        400
      );
    }

    if (!planType || !planName) {
      return sendFailureJSONResponse(
        res,
        { message: "Invalid Input" },
        400
      );
    }

    let mapPrice = planData[planName.toLowerCase()]

    if (Object.keys(mapPrice) < 0) {
      return sendFailureJSONResponse(
        res,
        { message: "Invalid Plan" },
        400
      );
    }

    let price = mapPrice[planType]
    console.log("price",price)
    let connection = userData?.app_token?.shopify
    if (!connection?.shop) {
      return sendFailureJSONResponse(
        res,
        { message: "There is problem in connection. Please try to connect shopify again." },
        400
      );

    }

    const { shop, access_token } = connection;

    let planInterval = "EVERY_30_DAYS";
    if (planType === "annual") {
      planInterval = "ANNUAL";
      price = price * 10;
    }

    let shopifyTest = MODE === "dev" ? true : null;

    let shopSubdomain = shop;
    let priceToCharge = price;

    const state = new OauthState({
      unique_key: uuidv4(),
      paymentCallback: {
        priceToCharge,
        shopSubdomain,
        planInterval,
        planName,
        userId,
        page: "billing",
      },
    });

    await state.save();
    const body = {
      query: `
      mutation appSubscriptionCreate($trialDays: Int!, $lineItems: [AppSubscriptionLineItemInput!]!) {
        appSubscriptionCreate(trialDays: $trialDays, lineItems: $lineItems) {
              appSubscription {
                id
              }
              confirmationUrl
              userErrors {
                field
                message
              }
            }
          }
          `,
      variables: {
        name: `TurboBoost Plan`,
        lineItems: [
          {
            plan: {
              appRecurringPricingDetails: {
                price: { amount: priceToCharge, currencyCode: "USD" },
                interval: planInterval,
              },
            },
          },
        ],
        test: shopifyTest,
        returnUrl: `${BACKEND_URL}/v1/user/paymentCallback?state=${state.unique_key}`,
      },
    };

    let shopifyResponse;

    try {

      shopifyResponse = await axios.post(
        `https://${shopSubdomain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
        body,
        {
          headers: {
            "X-Shopify-Access-Token": access_token,
          },
        }
      );

    } catch (err) {
      // console.log(err);
      console.error(err.response.status);
      const errorMessage =
        err.response.status === 401
          ? "Could not update plan because your Shopify credentials have expired"
          : "Could not update plan because there was an error with Shopify";
      return sendFailureJSONResponse(
        res,
        { message: errorMessage },
        400)
    }

    const confirmationUrl =
      shopifyResponse?.data.data.appSubscriptionCreate.confirmationUrl;

    return sendSuccessJSONResponse(res, {
      success: true,
      confirmationUrl,
      message: `You need to confirm on Shopify.`,
    });

  } catch (e) {
    console.log(e);
    return sendFailureJSONResponse(
      res,
      { message: 'something went wrong' },
      400)
  }
};

exports.paymentCallback = async (req, res, next) => {
  try {
    const { state, charge_id } = req.query;
    if (!state || !charge_id) {
      return res
        .status(400)
        .json({ success: false, message: "Something Went wrong" });
    }
    let stateData = await OauthState.findOne({ unique_key: state });
    let stackDataId = stateData?._id
    stateData = stateData?.paymentCallback
    let userId = stateData?.userId;
    if (!userId) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Issue",
      });
    }

    let billingHistoryObject = {
      date: new Date(),
      plan: stateData?.planName,
      billingCycle: stateData?.planInterval,
      amount: stateData?.priceToCharge,
      billingId: stateData?.response?.id,
      charge_id: charge_id,
    }

    let data = await Subscription.findOne({ userId: userId });
    if (data && Object.keys(data)?.length > 1 && data._id) {
      await Subscription.findByIdAndUpdate(data._id, {
        status: true,
        billingHistory: [...data?.billingHistory, billingHistoryObject]
      });
    } else {
      let subscriptionUpdate = new Subscription({
        status: true,
        userId: stateData?.userId,
        billingHistory: [billingHistoryObject]

      });
      await subscriptionUpdate.save();
    }
    await OauthState.deleteOne({ _id: stackDataId });
    res.redirect(`${FRONTEND_URL}/dashboard`);

  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

exports.getCurrentPlan = (req, res, next) => {
  const userId = req.userId;
  
  Subscription.findOne({ userId: userId })
    .then((foundSub) => {
     
      if (!foundSub) return sendFailureJSONResponse(res, { message: "No Subscription found" });
      else {
        
        const billingHistory = foundSub?.billingHistory;

        if (billingHistory && billingHistory.length) {
          const currentPlan = billingHistory[billingHistory.length - 1];
          return sendSuccessJSONResponse(res, { message: "", data: currentPlan });
        } else {
          return sendFailureJSONResponse(res, { message: "No Plan found" });
        }

      }
    })
}