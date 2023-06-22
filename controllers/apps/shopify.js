const { getSlug } = require("../../utils/mongoose"),
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
        SHOPIFY_API_REDIRECT
    } = process.env;

exports.appInstallations = async (req, res, next) => {

    try {

        const { ['hmac']: hmac, ...queryData } = req.query;

        const shop = queryData.shop,
            host = queryData.host,
            timestamp = queryData.timestamp;

        if (!shop || !hmac || !host || !timestamp) {
            return sendFailureJSONResponse(res, { message: "Unauthorized access" }, 401);
        }

        let keys = Object.keys(queryData),
            message = '';

        for (let x of keys) {
            message += `${x}=${queryData[x]}` //remove hmac from query string and forming new query string from hmac check
        }
        message = message.slice(1, message.length)

        // let message ={ ...req.query}
        // delete message["hmac"];

        const generatedHash = crypto.createHmac('SHA256', SHOPIFY_API_SECRET).update(message, 'utf8').digest('hex');

        if (generatedHash != hmac) return sendFailureJSONResponse(res, { message: "Unauthorized access" }, 401);

        // creating OuthState for security checking
        OauthState.create({
            unique_key: getSlug(),
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
            return sendFailureJSONResponse(res, { message: "Something went wrong" });
        })

    } catch (err) {
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
        }
            = req.query;
        if (!shop || !hmac || !host || !timestamp || !user_token || !code) {
            res.status(401).json({ error: "unauthorized access" })
            return
        }
        const message = `code=${code}&host=${host}&shop=${shop}&state=${user_token}&timestamp=${timestamp}`

        const generatedHash = crypto.createHmac('SHA256', SHOPIFY_API_SECRET).update(message, 'utf8').digest('hex');
        if (generatedHash != hmac) { //Security checks for hmac
            res.status(401).json({ error: "unauthorized access" })
            return
        }
        var regexp1 = new RegExp(/^[a-zA-Z0-9][a-zA-Z0-9\-]*.myshopify.com/); // Security checks for shop
        if (!regexp1.test(shop)) {
            res.status(401).json({ error: "Invalid shop" })
            return
        }

        const oauthState = await OauthState.findOne({ key: user_token });
        if (!oauthState) {
            res.redirect(`${process.env.FRONTEND_URL}/login`);
            return;
        }
        await OauthState.deleteOne({ _id: oauthState._id });

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
     

        res.redirect(`${process.env.FRONTEND_URL}/?t=${auth_token}`);
    } catch (err) {
        res.status(400).send({ message: `qwajdhgajhgdh` });
    }

}
