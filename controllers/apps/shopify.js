const { getSlug } = require("../../utils/mongoose"),
    mongoose = require("mongoose"),
    crypto = require("crypto"),
    Axios = require("axios"),
    User = mongoose.model("user"),
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
        SHOPIFY_API_SCOPES,
        serverUrl

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

        console.log(generatedHash)
        console.log(hmac)
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
                    app_token: {
                        shopify: data?.access_token
                    }
                }).then((newUser) => {
                    if (newUser) return sendSuccessJSONResponse(res, { message: "Succesfull login" });
                    else return sendFailureJSONResponse(res, { message: "Something went wrong" });
                }).catch((err) => {
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


// exports.fetchAllProduct = async (req, res, next) => {

//     // const config = {
//     //     method: 'GET',
//     //     url: 'https://turboboost-dev.myshopify.com/admin/api/2023-04/products.json',
//     //     headers: {
//     //         'X-Shopify-Access-Token': 'shpua_92e1118272f4b9fd9af36af7fd2ec2d2'
//     //     }
//     // };

//     // try {
//     //     const response = await Axios(config);
//     //     const responseData = response.data; // Extract the data from the response object

//     //     const ProductData = response?.data?.products;

//     //     for (var i = ProductData.length - 1; i >= 0; i--) {
//     //         console.log(ProductData[i].id);

//     //         const config1 = {
//     //             method: 'GET',
//     //             url:`https://turboboost-dev.myshopify.com/admin/api/2023-04/products/8406445752600/images.json`,
//     //             headers: {
//     //                 'X-Shopify-Access-Token': 'shpua_92e1118272f4b9fd9af36af7fd2ec2d2'
//     //             }
//     //         };

//     //         const responseq = await Axios(config1);
//     //         const responseDatwa = responseq.data; // Extract the data from the response object

//     //         console.log(responseDatwa)


//     //     }
//     //     // updateImageSource();

//     //     return res.json({ data: ProductData });
//     // } catch (error) {
//     //     // Handle the error appropriately
//     //     next(error);
//     // }

//     updateImageSource(req, res, next)
// }



const updateImageSource = async (req, res, next) => {


    try {

        const config = {
            method: 'PUT',
            url: `https://turboboost-dev.myshopify.com/admin/api/2023-04/products/8406445752600/images/41962190995736.json`,
            headers: {
                'X-Shopify-Access-Token': 'shpua_92e1118272f4b9fd9af36af7fd2ec2d2',
                'Content-Type': 'application/json',
            },
            data: {
                image: {
                    src: "https://res.cloudinary.com/dq7iwl5ql/image/upload/v1683666621/DEV/qjvzkaika7asslb5qspx.jpg",
                },
            },
        };

        const responseq = await Axios(config);
        const responseDatwa = responseq.data; // Extract the data from the response object

        //   const response = await Axios(config);
        console.log(`response************`, responseq.data)

        // return res.json({ data: response.data });
    } catch (error) {
        // Handle the error appropriately
        // next(error);
        console.log(error)
    }
};


exports.fetchAllProduct = async (req, res) => {

    let data = JSON.stringify({
        query: `mutation productImageUpdate($image: ImageInput!, $productId: ID!) {
                  productImageUpdate(image: $image, productId: $productId) {
                    image {
                      id,src
                    }
                    userErrors {
                      field
                      message
                    }
                  }
                }`,
        variables: {
            "image": {
                "altText": "mahesh dalle",
                "id": "gid://shopify/ProductImage/41962191454488",
                "src": "https://www.shutterstock.com/image-vector/example-red-square-grunge-stamp-260nw-327662909.jpg"
            },
            "productId": "gid://shopify/Product/8406446014744"
        }
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://turboboost-dev.myshopify.com/admin/api/2023-04/graphql.json',
        headers: {
            'X-Shopify-Access-Token': 'shpua_92e1118272f4b9fd9af36af7fd2ec2d2',
            'Content-Type': 'application/json',
            'Cookie': '__cf_bm=4SUrq29XCW4.ROWvgNsea_HYs4tpxw1hA1MqN_5016M-1687808384-0-AToLqgA5GmgslUR9bRyWh9X3U1/jWswRf2qbln1Qg7YZhPrH0njI6uY/nijxtVu1dhDjtdJh9Nde5SSbdLgXn4c='
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });

};

exports.createProductCreateWebHook = async (shop, accessToken) => { // call this on installing shopify app
    let uuid = crypto.randomUUID()
    const registerWebhookOptions = {
      method: 'POST',
      url: `https://${shop}/admin/api/2023-04/webhooks.json?access_token=${accessToken}`,
      data: {
        webhook: {
          topic: 'products/create',
          address: `${serverUrl}app/shopify/auth/uninstallApp/${uuid}`, // address of route of your product create webhook
          format: 'json',
        },
      },
    };
  
    try {
      await Axios(registerWebhookOptions);
      console.log(`Successfully registered webhook`);
    } catch (e) {
      // Needed for UI test cases - if on non development instance then proceed
      if (serverUrl !== 'http://localhost:8000') {
        return res.status(400).send({
          message: `Failed to register webhook: ${e}`,
          success: false,
        });
      }
    }
  }




exports.productCreateWebhook = async (req, res) => {
    try {
      const { id, name, api_client_id, shop_id, domain } = req.body;
      const hmac = req.get('X-Shopify-Hmac-Sha256');
      let key = SHOPIFY_API_SECRET.trim()
      const generatedHash = crypto.createHmac('SHA256', key).update(req.rawBody).digest('base64');
      const headerData = req.headers;
      console.log(SHOPIFY_API_SECRET.length, key.length, headerData['x-shopify-hmac-sha256'], generatedHash, headerData)
      if (hmac !== generatedHash) {
        return res.status(400).send({
          success: false,
          message: `Signature does not match`,
        });
      }
      console.log(shop_id, name, id, api_client_id, shop_id, domain, "check1");
      ///do what you want to perform on product create webhook
      
      res.status(200).send("success");
    }
    catch (e) {
      console.log(e)
      return res.status(500).send({
        success: false,
        message: `Signature does not match`,
      });
    }
  
  }