const { getSlug } = require("../../utils/mongoose"),
    mongoose = require("mongoose"),
    crypto = require("crypto"),
    Axios = require("axios"),
    User  = mongoose.model("user"),
    ShopifyService = require("../../services/apps/index"),
    OauthState = mongoose.model("outhState"),
    {
        sendSuccessJSONResponse,
        sendFailureJSONResponse,
        sendErrorJSONResponse
    } = require("../../handlers/jsonResponseHandlers"),

    {
        AUTH_JWT_SECRET_KEY,
        SHOPIFY_API_KEY,
        SHOPIFY_API_SECRET,
        SHOPIFY_API_REDIRECT,
        SHOPIFY_API_SCOPES
    } = process.env;

exports.appInstallations = async (req, res, next) => {

    try {

        const { ['hmac']: hmac, ...queryData } = req.query;

        const shop = queryData.shop,
            host = queryData.host,
            timestamp = queryData.timestamp;


        console.log(req.query)

        if (!shop || !hmac || !host || !timestamp) {
            return sendFailureJSONResponse(res, { message: "Unauthorized access" }, 401);
        }

        let keys = Object.keys(queryData),
            message = '';

        for (let x of keys) {
            message += `&${x}=${queryData[x]}` //remove hmac from query string and forming new query string from hmac check
        }
        message = message.slice(1, message.length)

        // let message ={ ...req.query}
        // delete message["hmac"];

        const generatedHash = crypto.createHmac('SHA256', SHOPIFY_API_SECRET).update(message, 'utf8').digest('hex');

        if (generatedHash != hmac) return sendFailureJSONResponse(res, { message: "Unauthorized access" }, 401);

        // creating OuthState for security checking
        OauthState.create({
            unique_key: "jahdga",
            data: {
                login: true,
                hmac: hmac,
                queryData: queryData,
            }

        }).then((newOuthState) => {
            if (newOuthState) {
                const redirect_url = `https://${shop}/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}&scope=${SHOPIFY_API_SCOPES}&state=${newOuthState?.unique_key}&redirect_uri=${SHOPIFY_API_REDIRECT}`
                return res.redirect(redirect_url);
            } else {
                return sendFailureJSONResponse(res, { message: "Something went wrong" });
            }
        }).catch((err) => {
            console.log(err)
            return sendFailureJSONResponse(res, { message: "Something went wrong" });
        })

    } catch (err) {
        console.log(err)
        return sendFailureJSONResponse(res, { message: "Something went wrong" });
    }
}



exports.authCallback = async (req, res, next) => {
    try {

        const {
            shop,
            code,
            state: user_token,
            timestamp,
            host,
            hmac
        } = req.query;

        if (!shop || !hmac || !host || !timestamp || !user_token || !code) {
            return sendFailureJSONResponse(res, { message: "unauthorized access" }, 401);
        }

        const message = `code=${code}&host=${host}&shop=${shop}&state=${user_token}&timestamp=${timestamp}`

        const generatedHash = crypto.createHmac('SHA256', SHOPIFY_API_SECRET).update(message, 'utf8').digest('hex');

        if (generatedHash != hmac) {
            return sendFailureJSONResponse(res, { message: "unauthorized access" }, 401);
        }

        const regexp1 = new RegExp(/^[a-zA-Z0-9][a-zA-Z0-9\-]*.myshopify.com/); // Security checks for shop

        if (!regexp1.test(shop)) return sendFailureJSONResponse(res, { message: "unauthorized access" });

        OauthState.findOne({
            unique_key: user_token
        }).then(async (foundOauthState) => {

            if (!foundOauthState) return sendFailureJSONResponse(res, { message: "Something went wrong" });
            else {

                await OauthState.deleteOne({ _id: foundOauthState._id });

                const config = {
                    method: 'POST',
                    url: `https://${shop}/admin/oauth/access_token`,
                    data: {
                        code: req.query.code,
                        client_id: SHOPIFY_API_KEY,
                        client_secret: SHOPIFY_API_SECRET,
                    },
                };

                const response = await Axios(config);
                const data = response.data;
                console.log(data)
                
                let shopData = await ShopifyService.getShopDetails(shop, data.access_token);
                console.log(shopData)
                // const email = shopData?.shop?.email
                // let name = shopData?.shop?.shop_owner
                // const first_name = name.split(' ')[0]
                // const last_name = name.split(' ')[1]
                // const { email, first_name, last_name } = response.data.associated_user;
                // let scopes = data.scope
                // let webhook = await this.createUninstallWebHook(shop, data.access_token) //create webhook function
              
                User.create({
                    app_token:{
                        shopify: data?.access_token
                    }
                }).then((newUser)=>{
                    if(newUser)  return sendSuccessJSONResponse(res, { message: "Succesfull login" });
                    else return sendFailureJSONResponse(res, { message: "Something went wrong" });
                }).catch((err)=>{
                    return sendFailureJSONResponse(res, { message: "Something went wrong" });
                })

            }

        }).catch((err) => {
            console.log(err)
            return sendFailureJSONResponse(res, { message: "Something went wrong" });
        })

    } catch (err) {
        console.log(err)
        return sendFailureJSONResponse(res, { message: "Something went wrong" });
    }

}
