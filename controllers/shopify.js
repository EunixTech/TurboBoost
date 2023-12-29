const mongoose = require("mongoose"),
    crypto = require("crypto"),
    Axios = require("axios"),
    minifyPageContent = require("../resources/scripts/minify-page-content"),
    addDNSPrefetch = require("../resources/scripts/add-dns-prefetch"),
    removeUnusedJavascritCode = require("../resources/scripts/remove-unused-javascript-code"),
    CheckFontFaceExists = require("../resources/scripts/checking-font-face"),
    addingFontDisplayInCss = require("../resources/scripts/add-font-display"),
    restoreResourceHints = require("../resources/scripts/restore-resource-hints"),
    convertStylesheets = require("../resources/scripts/convert-stylesheets"),
    removeWidthSizeAttribute = require("../resources/scripts/remove-width-attributes-Imgtag"),
    DelayGoogleFontLoading = require("../resources/scripts/delay-google-font-loading"),
    {
        addGoogleTagManager,
        checkForGoogleTagManager,
    } = require("../resources/scripts/google-tag-manager"),

    User = mongoose.model("user"),
    OauthState = mongoose.model("outhState"),
    {
        sendSuccessJSONResponse,
        sendFailureJSONResponse,
        sendErrorJSONResponse,
    } = require("../handlers/jsonResponseHandlers"),
    {
        losslessCompression,
        lossyCompression,
    } = require("../resources/image-compression"),
    {
        SHOPIFY_API_KEY,
        SHOPIFY_API_SECRET,
        SHOPIFY_API_REDIRECT,
        SHOPIFY_API_SCOPES,
        SHOPIFY_BASE_URL,
        MODE,
        DEV_FRONTEND_URL,
        LIVE_FRONTEND_URL,
        DEV_BACKEND_URL,
        LIVE_BACKEND_URL
    } = process.env;



const FRONTEND_URL = MODE === 'dev' ? DEV_FRONTEND_URL : LIVE_FRONTEND_URL;
const BACKEND_URL = MODE === 'dev' ? DEV_BACKEND_URL : LIVE_BACKEND_URL;

const { googleApiDisplaySwap } = require("../utils/commenRegrex");
const { v4: uuidv4 } = require('uuid');
require("../utils/mongoose");

const ShopifyAPI = require("../services/apps/shopify");

const uploadToCloudinary = require("../utils/uploadToCloudinary");

const downloadImage = require("../resources/downloadImage");
const { json } = require("express");

/**
 * Handle app installations
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.appInstallations = async (req, res) => {
  
    
    try {
        const { ["hmac"]: hmac, ...queryData } = req.query;

        const shop = queryData.shop,
            host = queryData.host,
            timestamp = queryData.timestamp;

            console.log("req.query", req.query)

        if (!shop || !hmac || !host || !timestamp) {
            return sendFailureJSONResponse(
            res, { message: "Unauthorized access1" },
                401
            );
        }

        let keys = Object.keys(queryData),
            message = "";

        for (let x of keys) {
            message += `&${x}=${queryData[x]}`; //remove hmac from query string and forming new query string from hmac check
        }
        message = message.slice(1, message.length);

        const generatedHash = crypto
            .createHmac("SHA256", SHOPIFY_API_SECRET)
            .update(message, "utf8")
            .digest("hex");

        if (generatedHash != hmac)
            return sendFailureJSONResponse( res, { message: "Unauthorized access2" }, 401);

        console.log("working11111")
        // creating OuthState for security checking
        OauthState.create({
            unique_key: uuidv4(),
            data: {
                login: true,
                hmac: hmac,
                queryData: queryData,
            },
        })
            .then((newOuthState) => {
                console.log("working11111sajdajshgd")
                if (newOuthState) {
                    const redirect_url = `https://${shop}/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}&scope=${SHOPIFY_API_SCOPES}&state=${newOuthState?.unique_key}&redirect_uri=${SHOPIFY_API_REDIRECT}`;
                    return res.redirect(redirect_url);
                } else {
                    return sendFailureJSONResponse(res, {
                        message: "Something went wrong",
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                return sendFailureJSONResponse(res, { message: "Something went wrong"});
            });
    } catch (err) {
        console.log(err);
        return sendFailureJSONResponse(res, { message: "Something went wrong" });
    }
};

/**
 * Handle authentication callback
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.authCallback = async (req, res) => {
    try {

        const { shop, code, state: user_token, timestamp, host, hmac } = req.query;
        console.log("req.query", req.query)

        if (!shop || !hmac || !host || !timestamp || !user_token || !code) {
            return sendFailureJSONResponse(
                res,
                { message: "unauthorized access3" },
                401
            );
        }

        const message = `code=${code}&host=${host}&shop=${shop}&state=${user_token}&timestamp=${timestamp}`;

        const generatedHash = crypto
            .createHmac("SHA256", SHOPIFY_API_SECRET)
            .update(message, "utf8")
            .digest("hex");

        if (generatedHash != hmac) {
            return sendFailureJSONResponse(
                res,
                { message: "unauthorized access4" },
                401
            );
        }

        const regexp1 = new RegExp(/^[a-zA-Z0-9][a-zA-Z0-9-]*.myshopify.com/); // Security checks for shop

        if (!regexp1.test(shop))
            return sendFailureJSONResponse(res, { message: "unauthorized access5" });

        OauthState.findOne({ unique_key: user_token})
            .then(async (foundOauthState) => {
                if (!foundOauthState)
                    return sendFailureJSONResponse(res, {
                        message: "Something went wrong1",
                    });

                else {
                    await OauthState.deleteOne({ _id: foundOauthState._id });
                    const config = {
                        method: "POST",
                        url: `https://${shop}/admin/oauth/access_token`,
                        data: {
                            code: req.query.code,
                            client_id: SHOPIFY_API_KEY,
                            client_secret: SHOPIFY_API_SECRET,
                        },
                    };



                    const response = await Axios(config);
                    const data = response.data;
                   
                    const ShopifyAPIAndMethod = new ShopifyAPI({
                        accessToken: data.access_token,
                        shop: process.env.SHOP,
                        version: process.env.SHOPIFY_API_VERSION,
                    });
            
                    let shopData = await ShopifyAPIAndMethod.getShopDetails(
                        shop,
                        data.access_token
                    );

            
                    const email = shopData?.shop?.email
                    const first_name = shopData?.shop?.shop_owner.split(' ')[0]
                    const last_name = shopData?.shop?.shop_owner.split(' ')[1]

                    let userData = await User.findOne({ 'app_token.shopify.shop': shop });
                        let redirectURI = "/dashboard";
                    if (userData) {
                        userData = await User.findByIdAndUpdate(userData._id,
                            {
                                'app_token.shopify.access_token': data?.access_token,
                                'app_token.shopify.isDeleted': false
                            }
                        )
                        redirectURI = "/dashboard"
                    } else {

                        userData = await User.create({
                            user_info: {
                                first_name: first_name,
                                last_name: last_name,
                                email_address: email,
                            },
                            app_token: {
                                shopify: {
                                    ...data, shop, isDeleted: false
                                },
                            },
                        })

                        redirectURI = "/billing"
                    }

                    // console.log(userData)
                    const state = new OauthState({
                        unique_key: uuidv4(),
                        data: {
                            login: true,
                            action: "loginAfterInstall",
                            userID: userData?._id,
                            redirectURI: redirectURI
                        },
                    });
                    let webhook = await createUninstallWebHook(shop, data.access_token)
                    await state.save();
                    return res.redirect(`${FRONTEND_URL}?userToken=${state?.unique_key}`)
                }

            })
            .catch((err) => {
                console.log(err)
                return sendFailureJSONResponse(res, { message: "Something went wrong"});
            });
    } catch (err) {
        console.log(err)
        return sendFailureJSONResponse(res, { message: "Something went wrong" });
    }
};

exports.customerData = async (req, res) => {
    const hmac = req.get('X-Shopify-Hmac-Sha256');
    const generatedHash = crypto.createHmac('SHA256', SHOPIFY_API_SECRET).update(JSON.stringify(req.body), 'utf8').digest('base64');
    if (hmac === generatedHash) {
        console.log("match")
        res.status(200).send();
    } else {
        console.log("not match")
        res.status(401).send("Not Authorized");
    }
}
exports.customerRedact = async (req, res) => {
    const hmac = req.get('X-Shopify-Hmac-Sha256');
    const generatedHash = crypto.createHmac('SHA256', SHOPIFY_API_SECRET).update(JSON.stringify(req.body), 'utf8').digest('base64');
    if (hmac === generatedHash) {
        console.log("match")
        res.status(200).send();
    } else {
        console.log("not match")
        res.status(401).send("Not Authorized");
    }
}
exports.shopRedact = async (req, res) => {
    const hmac = req.get('X-Shopify-Hmac-Sha256');
    const generatedHash = crypto.createHmac('SHA256', SHOPIFY_API_SECRET).update(JSON.stringify(req.body), 'utf8').digest('base64');
    if (hmac === generatedHash) {
        console.log("match")
        res.status(200).send();
    } else {
        console.log("not match")
        res.status(401).send("Not Authorized");
    }
}


exports.productCreateWebhook = async (req, res) => {
    try {
        const { id, name, api_client_id, shop_id, domain } = req.body;
        const hmac = req.get("X-Shopify-Hmac-Sha256");
        let key = SHOPIFY_API_SECRET.trim();
        const generatedHash = crypto
            .createHmac("SHA256", key)
            .update(req.rawBody)
            .digest("base64");
        const headerData = req.headers;
        console.log(
            SHOPIFY_API_SECRET.length,
            key.length,
            headerData["x-shopify-hmac-sha256"],
            generatedHash,
            headerData
        );
        if (hmac !== generatedHash) {
            return res.status(400).send({
                success: false,
                message: `Signature does not match`,
            });
        }
        console.log(shop_id, name, id, api_client_id, shop_id, domain, "check1");
        ///do what you want to perform on product create webhook

        res.status(200).send("success");
    } catch (e) {
        console.log(e);
        return res.status(500).send({
            success: false,
            message: `Signature does not match`,
        });
    }
};

exports.addingLazyLoading = async (req, res, next) => {
    // ShopifyAPIAndMethod.init();


       

};

exports.minifyJavascriptCode = async (req, res, next) => {

    const ShopifyAPIAndMethod = new ShopifyAPI({
        accessToken: req.accessToken,
        shop: process.env.SHOP,
        version: "2022-10",
    });
    await ShopifyAPIAndMethod.init();
    
    
    const themeAssets = await ShopifyAPIAndMethod.getAssets();
    const assets = themeAssets.assets;

    const cssAssets = assets.filter((asset) => asset.content_type === "application/javascript");

    for (const cssAsset of cssAssets) {
        const publicURL = cssAsset?.public_url;
        const name = cssAsset?.key;

        try {
            await ShopifyAPIAndMethod.writeAsset({
                name: name,
                value: value,
            });
        } catch (error) {
            console.log(`Error occurred while writing asset:`, error);
            continue; // Continue to the next iteration of the loop
        }

    }
    return sendSuccessJSONResponse(res,{
        message: "success"
    })

};

/**
 * Removes unused JavaScript code from HTML.
 *
 * @param {string} html - The HTML string.
 * @returns {string} - The updated HTML string with unused JavaScript code removed.
 */

exports.removeUnusedJavascriptCode = async (req, res, next) => {

    try {
        const ShopifyAPIAndMethod = new ShopifyAPI({
            accessToken: req.accessToken,
            shop: process.env.SHOP,
            version: process.env.SHOPIFY_API_VERSION,
        });
        await ShopifyAPIAndMethod.init();
        
        const themeLiquid = await ShopifyAPIAndMethod.getThemeLiquid(),
            htmlContent = themeLiquid?.value,
            updatedThemeLiquid = removeUnusedJavascritCode(htmlContent);

        const resposne = await ShopifyAPIAndMethod.writeAsset({
            name: "layout/theme.liquid",
            value: updatedThemeLiquid,
        });

        if (resposne) return sendSuccessJSONResponse(res, { message: "success" });
        else
            return sendFailureJSONResponse(res, { message: "something went right" });
    } catch (error) {
        return sendErrorJSONResponse(res, { message: "Something went wrong" });
    }

};

exports.eliminateRenderBlockingResources = async (req, res, next) => {
    try {
        const ShopifyAPIAndMethod = new ShopifyAPI({
            accessToken: req.accessToken,
            shop: process.env.SHOP,
            version: "2022-10",
        });
        await ShopifyAPIAndMethod.init();
    
        
        const themeLiquid = await ShopifyAPIAndMethod.getThemeLiquid(),
            htmlContent = themeLiquid?.value,
            updatedThemeLiquid = await convertStylesheets(htmlContent);

        const resposne = await ShopifyAPIAndMethod.writeAsset({
            name: "layout/theme.liquid",
            value: updatedThemeLiquid,
        });

        if (resposne) return sendSuccessJSONResponse(res, { message: "success" });
        else
            return sendFailureJSONResponse(res, { message: "something went right" });
    } catch (error) {
        return sendErrorJSONResponse(res, { message: "Something went wrong" });
    }
};

exports.minifyPageContent = async (req, res, next) => {
    try {
        const ShopifyAPIAndMethod = new ShopifyAPI({
            accessToken: req.accessToken,
            shop: process.env.SHOP,
            version: process.env.SHOPIFY_API_VERSION,
        });
        await ShopifyAPIAndMethod.init();
    
        const pages = await ShopifyAPIAndMethod.getAllPages();

        if (pages?.length) {
            for (let i = pages.length - 1; i >= 0; i--) {
                const pageContent = pages[i]?.body_html,
                    pageId = pages[i]?.id;

                if (pageContent) {
                    const minifiedPageContent = await minifyPageContent(pageContent);

                    await ShopifyAPIAndMethod.updatePageContent({
                        pageId,
                        pageContent: minifiedPageContent,
                    });
                }
            }
        }

        return sendSuccessJSONResponse(res, { message: "success" });
    } catch (error) {
        return sendErrorJSONResponse(res, { message: "Something went wrong" });
    }
};

exports.DNSPrefetching = async (req, res, next) => {
    try {
        const ShopifyAPIAndMethod = new ShopifyAPI({
            accessToken: req.accessToken,
            shop: process.env.SHOP,
            version: process.env.SHOPIFY_API_VERSION,
        });
        await ShopifyAPIAndMethod.init();
    
        const themeLiquid = await ShopifyAPIAndMethod.getThemeLiquid(),
            htmlContent = themeLiquid?.value;

        const updatedContent = addDNSPrefetch(htmlContent);

        await ShopifyAPIAndMethod.writeAsset({
            name: "layout/theme.liquid",
            value: updatedContent,
        });

        return sendSuccessJSONResponse(res, { message: "success" });
    } catch (error) {
        return sendErrorJSONResponse(res, { message: "Something went wrong" });
    }
};

// image adaptions login
exports.imageSizeAdaptions = (req, res) => {
    //this features combine with lazy loading
};

exports.criticalCSS = async (req, res) => {
    try {
        const ShopifyAPIAndMethod = new ShopifyAPI({
            accessToken: req.accessToken,
            shop: process.env.SHOP,
            version: process.env.SHOPIFY_API_VERSION,
        });
        await ShopifyAPIAndMethod.init();

        const session = await Shopify.Utils.loadCurrentSession(
            ctx.req,
            ctx.res,
            true
        );
        if (!session) {
            ctx.body = JSON.stringify({ error: "could not find session" });
            return;
        }
        console.log(
            `/generate for ${session.shop} with access token: ${session.accessToken}`
        );
        const job = await workQueue.add({
            type: "generate",
            shop: session.shop,
            accessToken: session.accessToken,
        });
        console.log(`created job ${job.id}`);
        ctx.body = JSON.stringify({ id: job.id });
    } catch (e) {
        console.log(e);
        ctx.body = JSON.stringify({ error: "could not find session" });
    }
};

exports.lossyImageCompression = async (req, res) => {
    const products = await ShopifyAPIAndMethod.fetchAllProducts();

    if (products?.length) {

        for (i = products.length - 1; i >= 0; i--) {
            const productId = products[i]?.id,
                imageId = products[i]?.image?.id,
                imageURL = products[i]?.image?.src;

            if (imageURL) {
                const downloadedImgae = await downloadImage(Axios, imageURL);
                const compressedImage = await lossyCompression(downloadedImgae);
                const res = await uploadToCloudinary(compressedImage, (options = {}));

                const productss = ShopifyAPIAndMethod.updateProductImages(
                    productId,
                    imageId,
                    res.url
                );
            }
        }
    }
    return res.json({
        data: "success",
    });
};

exports.losslessImageCompression = async (req, res, next) => {
    try {
        const products = await ShopifyAPIAndMethod.fetchAllProducts();

        if (products?.length) {
            for (i = products.length - 1; i >= 0; i--) {
                const productId = products[i]?.id,
                    imageId = products[i]?.image?.id,
                    imageURL = products[i]?.image?.src;

                if (imageURL) {
                    const downloadedImgae = await downloadImage(Axios, imageURL);
                    const compressedImage = await losslessCompression(downloadedImgae);
                    const res = await uploadToCloudinary(compressedImage, (options = {}));

                    await ShopifyAPIAndMethod.updateProductImages(
                        productId,
                        imageId,
                        res.url
                    );
                }
            }
        }

        return sendSuccessJSONResponse(res, { message: "success" });
    } catch (error) {
        return sendErrorJSONResponse(res, { message: "Something went wrong" });
    }
};

exports.losslessCompCollection = async (req, res, next) => {
    /* 
        1 = loassy compression
        2 = loassless compression
      */
    const compressionType = req?.query?.compressionType;

    if (!compressionType) return sendFailureJSONResponse(res, { message: `please provide compression type`, });

    const smartCollections = await ShopifyAPIAndMethod.fetchSmartCollection();

    if (smartCollections?.length) {
        for (i = smartCollections.length - 1; i >= 0; i--) {
            const smartCollectionId = smartCollections[i]?.id,
                imageURL = smartCollections[i]?.src;

            const downloadedImgae = await downloadImage(Axios, imageURL);

            let compressedImage;
            if (compressionType === 1) {
                compressedImage = await lossyCompression(downloadedImgae);
            } else if (compressionType === 2) {
                compressedImage = await losslessCompression(downloadedImgae);
            }

            const data = JSON.stringify({
                smart_collection: {
                    id: smartCollectionId,
                    image: compressedImage,
                    admin_graphql_api_id: `gid://shopify/Collection/${smartCollectionId}`,
                },
            });

            let config = {
                method: "put",
                url: `https://turboboost-dev.myshopify.com/admin/api/unstable/smart_collections/${smartCollectionId}.json`,
                headers: {
                    "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
                    "Content-Type": "application/json",
                },
                data: data,
            };

            Axios.request(config)
                .then((response) => { })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    return rsendSuccessJSONResponse(res, { message: `success` });
};

exports.fontOptimization = async (req, res, next) => {
    try {
        const ShopifyAPIAndMethod = new ShopifyAPI({
            accessToken: req.accessToken,
            shop: process.env.SHOP,
            version: process.env.SHOPIFY_API_VERSION,
        });
        await ShopifyAPIAndMethod.init();

        const themeAssets = await ShopifyAPIAndMethod.getAssets();
        const assets = themeAssets.assets;
        const cssAssets = assets.filter((asset) => asset.content_type === "text/css");

        for (const cssAsset of cssAssets) {
            const publicURL = cssAsset?.public_url;
            const name = cssAsset?.key;

            const { fontExists, cssContent } = await CheckFontFaceExists(publicURL);

            if (fontExists) {
                const value = await addingFontDisplayInCss(cssContent);

                try {
                    await ShopifyAPIAndMethod.writeAsset({
                        name: name,
                        value: value,
                    });
                } catch (error) {
                    console.log(`Error occurred while writing asset:`, error);
                    continue; // Continue to the next iteration of the loop
                }
            }
        }

        return sendSuccessJSONResponse(res, { message: "success" });
    } catch (error) {
        return sendFailureJSONResponse(res, { message: "Something went wrong" });
    }
};

exports.delayingGoogleFont = async (req, res, next) => {
    try {
        const ShopifyAPIAndMethod = new ShopifyAPI({
            accessToken: req.accessToken,
            shop: process.env.SHOP,
            version: process.env.SHOPIFY_API_VERSION,
        });
        await ShopifyAPIAndMethod.init();

        const themeLiquid = await ShopifyAPIAndMethod.getThemeLiquid(),
            htmlContent = themeLiquid?.value,
            updatedThemeContent = DelayGoogleFontLoading(htmlContent);

        const updateTheme = await ShopifyAPIAndMethod.writeAsset({
            name: "layout/theme.liquid",
            value: updatedThemeContent,
        });

        if (!updateTheme) {
            return sendFailureJSONResponse(res, { message: "something went wrong" });
        } else {
            return sendSuccessJSONResponse(res, { message: "success" });
        }
    } catch (error) {
        return sendErrorJSONResponse(res, { message: "something went wrong" });
    }
};

exports.addingGoogleTagManager = async (req, res, next) => {
    try {
        const gtmKey = req.body.gtmKey;

        const themeLiquid = await ShopifyAPIAndMethod.getThemeLiquid();
        const themeContent = themeLiquid?.value;

        const isExist = checkForGoogleTagManager(themeContent);

        if (!isExist) {
            const updatedContent = addGoogleTagManager(htmlContent, gtmKey);

            const updatedTheme = await ShopifyAPIAndMethod.writeAsset({
                name: "layout/theme.liquid",
                value: updatedContent,
            });

            if (updatedTheme) {
                return sendSuccessJSONResponse(res, {
                    message: "success",
                });
            } else {
                return sendFailureJSONResponse(res, {
                    message: "Something went wrong",
                });
            }
        } else {
            return sendFailureJSONResponse(res, { message: "Something went wrong" });
        }
    } catch (error) {
        return sendErrorJSONResponse(res, { message: "Something went wrong" });
    }
};

// restoration api started
exports.restoringFontOptimization = async (req, res, next) => {
    try {
          const ShopifyAPIAndMethod = new ShopifyAPI({
            accessToken: req.accessToken,
            shop: process.env.SHOP,
            version: process.env.SHOPIFY_API_VERSION,
        });
        await ShopifyAPIAndMethod.init();

        const themeAssets = await ShopifyAPIAndMethod.getAssets();
        const assets = themeAssets.assets;
        const cssAssets = assets.filter(
            (asset) => asset.content_type === "text/css"
        );

        for (const cssAsset of cssAssets) {
            const publicURL = cssAsset?.public_url;
            const name = cssAsset?.key;

            const { fontExists, cssContent } = await CheckFontFaceExists(publicURL);

            if (fontExists) {
                const value = cssContent.replace(/(font-display\s*:\s*[^;]+;)/g, "");

                try {
                    await ShopifyAPIAndMethod.writeAsset({
                        name: name,
                        value: value,
                    });
                } catch (error) {
                    console.log(`Error occurred while writing asset:`, error);
                    continue; // Continue to the next iteration of the loop
                }
            }
        }

        return sendSuccessJSONResponse(res, { message: "success" });
    } catch (error) {
        console.log(`error`, error);
        return sendFailureJSONResponse(res, { message: "Something went wrong" });
    }
};

exports.restoreGoogleFontDelay = async (req, res, next) => {
    try {
        const ShopifyAPIAndMethod = new ShopifyAPI({
            accessToken: req.accessToken,
            shop: process.env.SHOP,
            version: process.env.SHOPIFY_API_VERSION,
        });
        await ShopifyAPIAndMethod.init();

        const themeLiquid = await ShopifyAPIAndMethod.getThemeLiquid();
        const themeContent = themeLiquid?.value;

        const modifiedContent = themeContent.replace(
            googleApiDisplaySwap,
            (match) => match.replace("&display=swap", "")
        );

        const res = await ShopifyAPIAndMethod.writeAsset({
            name: "layout/theme.liquid",
            value: modifiedContent,
        });

        if (!res)
            return sendFailureJSONResponse(res, { message: "something went wrong" });
        else {
            return sendSuccessJSONResponse(res, { message: "success" });
        }
    } catch (error) {
        return sendErrorJSONResponse(res, { message: "something went wrong" });
    }
};

exports.restoreDNSPrefetching = async (req, res, next) => {
    try {
        const ShopifyAPIAndMethod = new ShopifyAPI({
            accessToken: req.accessToken,
            shop: process.env.SHOP,
            version: process.env.SHOPIFY_API_VERSION,
        });
        await ShopifyAPIAndMethod.init();

        const themeLiquid = await ShopifyAPIAndMethod.getThemeLiquid(),
            htmlContent = themeLiquid?.value;

        const updateThemeContent = restoreResourceHints(htmlContent);

        const res = await ShopifyAPIAndMethod.writeAsset({
            name: "layout/theme.liquid",
            value: updateThemeContent,
        });

        if (!res) {
            return sendFailureJSONResponse(res, { message: "Something went wrong" });
        } else {
            return sendSuccessJSONResponse(res, { message: "message" });
        }
    } catch (error) {
        return sendFailureJSONResponse(res, { message: "Something went wrong" });
    }
};

exports.restoreAdvancedLazyLoading = async (req, res, next) => {
    try {
        const ShopifyAPIAndMethod = new ShopifyAPI({
            accessToken: req.accessToken,
            shop: process.env.SHOP,
            version: process.env.SHOPIFY_API_VERSION,
        });
        await ShopifyAPIAndMethod.init();

        const themeLiquid = await ShopifyAPIAndMethod.getThemeLiquid(),
            htmlContent = themeLiquid?.value;

        const updateThemeContent = commentOutIncludes(htmlContent);

        const p = [];
        p.push(shopifyAdmin.deleteAsset("snippets/responsive-image.liquid"));
        p.push(shopifyAdmin.deleteAsset("snippets/Bgset.liquid"));
        p.push(shopifyAdmin.deleteAsset("assets/lazyloading.js"));
        await Promise.all(p);

        await ShopifyAPIAndMethod.writeAsset({
            name: "layout/theme.liquid",
            value: updateThemeContent,
        });
        return sendSuccessJSONResponse(res, { message: "success" });
    } catch (error) {
        return sendFailureJSONResponse(res, { message: "Something went wrong" });
    }
};

function commentOutIncludes(html) {
    const includePattern = /{%\s*include\s*'responsive-image'.*?%}/g;
    return html.replace(includePattern, (match) => `<!-- ${match} -->`);
}

exports.restoreCriticalCss = async (req, res, next) => {

    await criticalCssRestore(shopifyAdmin, redisStore);
};

exports.restoreImageSizeAdaption = async (req, res, next) => {

    try {
        const ShopifyAPIAndMethod = new ShopifyAPI({
            accessToken: req.accessToken,
            shop: process.env.SHOP,
            version: process.env.SHOPIFY_API_VERSION,
        });
        await ShopifyAPIAndMethod.init();

        const snippets = await ShopifyAPIAndMethod.getAssetByName(
            "snippets/responsive-image.liquid"
        ),
            snippetsContent = snippets?.value;

        const updateSnippetsContent = removeWidthSizeAttribute(snippetsContent);

        const res = await ShopifyAPIAndMethod.writeAsset({
            name: "snippets/responsive-image.liquid",
            value: updateSnippetsContent,
        });

        if (!res) {
            return sendFailureJSONResponse(res, { message: "Something went wrong" });
        } else {
            return sendSuccessJSONResponse(res, { message: "success" });
        }
    } catch (error) { 
        return sendErrorJSONResponse(res, { message: "Something went wrong" });
    }
};

exports.restoreImageCompression = async (req, res, next) => {
    try {

        ProductImage.find({})
            .then(async (images) => {

                for (let i = images.length - 1; i >= 0; i--) {

                    const imageURL = images[i]?.url,
                        productId = images[i]?.product_id,
                        imageId = images[i]?.image_id,
                        imagePosition = images[i]?.position;

                    await ShopifyAPIAndMethod.updateProductImages({
                        productId,
                        imageId,
                        imageURL,
                        imagePosition
                    });
                }

            })

        return sendSuccessJSONResponse(res, { message: "success " })


    } catch (error) {
        return sendErrorJSONResponse(res, { message: "Something went wrong" });
    }
};

/**
 * Turn OFF critical css for the shop
 * @param {Object} shopifyAdmin
 */
async function criticalCssRestore(shopifyAdmin, redisStore) {
    try {
        const session = await Shopify.Utils.loadCurrentSession(
            ctx.req,
            ctx.res,
            true
        );
        if (!session) {
            ctx.body = JSON.stringify({ error: "could not find session" });
            return;
        }
        const job = await workQueue.add({
            type: "restore",
            shop: session.shop,
            accessToken: session.accessToken,
        });
        console.log(`created job ${job.id}`);
        ctx.body = JSON.stringify({ id: job.id });
    } catch (e) {
        console.log(e);
        ctx.body = JSON.stringify({ error: "could not find session" });
    }
}


exports.appUninstallation = (req, res) =>{
 
      
         const { id, name, api_client_id, shop_id, domain } = req.body;
         console.log("uninstall hook working",api_client_id, name);
         console.log(req.body)
        res.json("working");


    // try {

    //     const { id, name, api_client_id, shop_id, domain } = req.body;
    
    //     const hmac = req.get('X-Shopify-Hmac-Sha256');
    //     // const message = req.body.toString();
    //     // const genHash = crypto
    //     // .createHmac("sha256", SHOPIFY_API_SECRET)
    //     // .update(message)
    //     // .digest("base64");
    //     // const rawBody = await getRawBody(req);
    //     // const generated_hash = crypto
    //     //       .createHmac('sha256', SHOPIFY_API_SECRET)
    //     //       .update()
    //     //       .digest('base64');
    //     let key=SHOPIFY_API_SECRET.trim()
    
    //   const generatedHash = crypto.createHmac('SHA256', key).update(req.rawBody).digest('base64');
    
    
    //     // const generatedHash4= crypto.createHmac('sha256', SHOPIFY_API_SECRET).update(msg).digest('base64');
    //     const headerData = req.headers;
    //     console.log(SHOPIFY_API_SECRET.length,key.length,headerData['x-shopify-hmac-sha256'],generatedHash,headerData)
    //     if (hmac !== generatedHash) {
    //       return res.status(400).send({
    //         success: false,
    //         message: `Signature does not match`,
    //       });
    //     }
    //     console.log(shop_id, name, id, api_client_id, shop_id, domain, "check1");
    //     const connection = await Connection.findOneAndUpdate({ "connectData.shop": domain, "integrationId": '624a9d961714610a785216ca' }, { isDeleted: true });
    //     await forceLogout('forceLogout', { type: 'appUninstalled' }) //this is socket funtion for logout user
    //     res.status(200).send("success");
    //   }
    //   catch (e) {
    //     console.log(e)
    //     return res.status(500).send({
    //       success: false,
    //       message: `Signature does not match`,
    //     });
    //   }
}

const createUninstallWebHook = async (shop, accessToken) => {
    
    const registerWebhookOptions = {
      method: 'POST',
      url: `https://${shop}/admin/api/2022-07/webhooks.json?access_token=${accessToken}`,
      data: {
        webhook: {
          topic: 'app/uninstalled',
          address: `${BACKEND_URL}/v1/api/shopify/app-uninstall`,
          format: 'json',
        },
      },
    };
  
    try {
      await Axios(registerWebhookOptions);
      console.log(`Successfully registered webhook`);
    } catch (e) {
   
    }
  }
  