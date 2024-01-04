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

    console.log("planType", planType)
    console.log("planName", planName)

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

    console.log("planType", planType)
    console.log("planName", planName)
    console.log("mapPrice", mapPrice)

    if (Object.keys(mapPrice) < 0) {
      return sendFailureJSONResponse(
        res,
        { message: "Invalid Plan" },
        400
      );
    }

    let price = mapPrice[planType]
    console.log("price", price)
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


    let mutataionBody = {};

    if (mapPrice?.PlanName === "Basic" || Number(priceToCharge) === 0) {
      mutationBody = {
        query: `mutation AppSubscriptionCreate($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!, $pageViews: Int!, $activeUsers: Int!) {
          appSubscriptionCreate(name: $name, returnUrl: $returnUrl, lineItems: $lineItems, pageViews: $pageViews, activeUsers: $activeUsers) {
            userErrors {
              field
              message
            }
            appSubscription {
              id
              lineItems {
                id
                plan {
                  pricingDetails {
                    __typename
                  }
                }
              }
            }
            confirmationUrl
          }
        }`,
        variables: {
          "name": "TurboBoost Plan",
          "test": true,
          "pageViews": 1500,
          "activeUsers": 50,  // Add the number of active users here
          "returnUrl": `${BACKEND_URL}/v1/user/paymentCallback?state=${state.unique_key}`,
          lineItems: [
            {
              plan: {
                appUsagePricingDetails: {
                  terms: "$15 for under 1000 page views and up to 50 active users",  // Adjust terms for active users
                  cappedAmount: {
                    amount: 15,
                    currencyCode: "USD"
                  }
                }
              }
            },
      
            {
              plan: {
                appUsagePricingDetails: {
                  terms: "$30 for 1001 to 2000 page views and 51 to 100 active users",  // Adjust terms for active users
                  cappedAmount: {
                    amount: 30,
                    currencyCode: "USD"
                  }
                }
              }
            }
          ]
        }
      }
      
    } else {
      mutataionBody = {
        query: `mutation AppSubscriptionCreate($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!,$test: Boolean, $trialDays: Int) {
            appSubscriptionCreate(name: $name, returnUrl: $returnUrl, lineItems: $lineItems, $test: Boolean, trialDays: $trialDays) {
              userErrors {
                field
                message
              }
              appSubscription {
                id
              }
              confirmationUrl
            }
          }`,
        variables:
        {
          "name": "TurboBoost Plan",
          test: shopifyTest,
          "returnUrl": `${BACKEND_URL}/v1/user/paymentCallback?state=${state.unique_key}`,
          "trialDays": 7,
          "lineItems": [
            {
              "plan": {
                "appRecurringPricingDetails": {
                  "price": { amount: priceToCharge, currencyCode: "USD" },
                  interval: planInterval,
                }
              }
            }
          ]
        }
      }
    }
    const body = {
      // query: `
      //     mutation appSubscriptionCreate($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!,$test: Boolean) {
      //       appSubscriptionCreate(name: $name, lineItems: $lineItems, returnUrl: $returnUrl,test:$test) {
      //         appSubscription {
      //           id
      //         }
      //         confirmationUrl
      //         userErrors {
      //           field
      //           message
      //         }
      //       }
      //     }
      //     `,
      // variables: {
      //   name: `TurboBoost Plan`,
      //   lineItems: [
      //     {
      //       plan: {
      //         appRecurringPricingDetails: {
      //           price: { amount: priceToCharge, currencyCode: "USD" },
      //           interval: planInterval,
      //         },
      //       },
      //     },
      //   ],
      //   test: shopifyTest,
      //   returnUrl: `${BACKEND_URL}/v1/user/paymentCallback?state=${state.unique_key}`,
      // },
      //       query: `mutation AppSubscriptionCreate($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!, $trialDays: Int) {
      //   appSubscriptionCreate(name: $name, returnUrl: $returnUrl, lineItems: $lineItems, trialDays: $trialDays) {
      //     userErrors {
      //       field
      //       message
      //     }
      //     appSubscription {
      //       id
      //     }
      //     confirmationUrl
      //   }
      // }`,
      //       variables:
      //       {
      //         "name": "Super Duper Recurring Plan with a Trial",
      //         "returnUrl": `${BACKEND_URL}/v1/user/paymentCallback?state=${state.unique_key}`,
      //         "trialDays": 7,
      //         "lineItems": [
      //           {
      //             "plan": {
      //               "appRecurringPricingDetails": {
      //                 "price": {
      //                   "amount": 10,
      //                   "currencyCode": "USD"
      //                 }
      //               }
      //             }
      //           }
      //         ]
      //       }

      //       query: `mutation AppSubscriptionCreate($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!) {
      //      appSubscriptionCreate(name: $name, returnUrl: $returnUrl, lineItems: $lineItems) {
      //     userErrors {
      //       field
      //       message
      //     }
      //     appSubscription {
      //       id
      //       lineItems {
      //         id
      //         plan {
      //           pricingDetails {
      //             __typename
      //           }
      //         }
      //       }
      //     }
      //     confirmationUrl
      //   }
      // }`,
      //       variables: {
      //         "name": "Super Duper Recurring and Usage Plan",
      //         "returnUrl": `${BACKEND_URL}/v1/user/paymentCallback?state=${state.unique_key}`,
      //         "lineItems": [
      //           {
      //             "plan": {
      //               "appUsagePricingDetails": {
      //                 "terms": "$1 for 100 emails",
      //                 "cappedAmount": {
      //                   "amount": 20,
      //                   "currencyCode": "USD"
      //                 }
      //               }
      //             }
      //           }
      //         ]
      //       }
    };

    let shopifyResponse;

    try {

      shopifyResponse = await axios.post(
        `https://${shopSubdomain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
        mutataionBody,
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