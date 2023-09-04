const mongoose = require("mongoose"),
  crypto = require("crypto"),
  Axios = require("axios"),
  fs = require("fs"),
  ReplaceImagTag = require("../resources/scripts/replace-image-tag"),
  cssbeautify = require("cssbeautify"),
  Cheerio = require("cheerio"),
  UglifyJS = require("uglify-es"),
  minifyPageContent = require("../resources/scripts/minify-page-content"),
  AssetsCaching = require("../resources/scripts/assets-caching"),
  addDNSPrefetch = require("../resources/scripts/add-dns-prefetch"),
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
  ShopifyService = require("../services/apps/index"),
  { getFetchConfig } = require("../utils/getFetchConfig"),
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
  } = process.env;

const { googleApiDisplaySwap } = require("../utils/commenRegrex");

require("../utils/mongoose");

const ShopifyAPI = require("../services/apps/shopify");

const ShopifyAPIAndMethod = new ShopifyAPI({
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
  shop: process.env.SHOP,
  version: process.env.SHOPIFY_API_VERSION,
});

ShopifyAPIAndMethod.init();

const uploadToCloudinary = require("../utils/uploadToCloudinary");

const downloadImage = require("../resources/downloadImage");

exports.appInstallations = async (req, res) => {
  try {
    const { ["hmac"]: hmac, ...queryData } = req.query;

    const shop = queryData.shop,
      host = queryData.host,
      timestamp = queryData.timestamp;

    if (!shop || !hmac || !host || !timestamp) {
      return sendFailureJSONResponse(
        res,
        { message: "Unauthorized access" },
        401
      );
    }

    let keys = Object.keys(queryData),
      message = "";

    for (let x of keys) {
      message += `&${x}=${queryData[x]}`; //remove hmac from query string and forming new query string from hmac check
    }
    message = message.slice(1, message.length);

    // let message ={ ...req.query}
    // delete message["hmac"];

    const generatedHash = crypto
      .createHmac("SHA256", SHOPIFY_API_SECRET)
      .update(message, "utf8")
      .digest("hex");

    console.log(generatedHash);
    console.log(hmac);
    if (generatedHash != hmac)
      return sendFailureJSONResponse(
        res,
        { message: "Unauthorized access" },
        401
      );

    // creating OuthState for security checking
    OauthState.create({
      unique_key: "jahdga",
      data: {
        login: true,
        hmac: hmac,
        queryData: queryData,
      },
    })
      .then((newOuthState) => {
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
        return sendFailureJSONResponse(res, {
          message: "Something went wrong",
        });
      });
  } catch (err) {
    console.log(err);
    return sendFailureJSONResponse(res, { message: "Something went wrong" });
  }
};

exports.authCallback = async (req, res) => {
  try {
    const { shop, code, state: user_token, timestamp, host, hmac } = req.query;

    if (!shop || !hmac || !host || !timestamp || !user_token || !code) {
      return sendFailureJSONResponse(
        res,
        { message: "unauthorized access" },
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
        { message: "unauthorized access" },
        401
      );
    }

    const regexp1 = new RegExp(/^[a-zA-Z0-9][a-zA-Z0-9-]*.myshopify.com/); // Security checks for shop

    if (!regexp1.test(shop))
      return sendFailureJSONResponse(res, { message: "unauthorized access" });

    OauthState.findOne({
      unique_key: user_token,
    })
      .then(async (foundOauthState) => {
        if (!foundOauthState)
          return sendFailureJSONResponse(res, {
            message: "Something went wrong",
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
          console.log(data);

          let shopData = await ShopifyService.getShopDetails(
            shop,
            data.access_token
          );
          console.log(shopData);
          // const email = shopData?.shop?.email
          // let name = shopData?.shop?.shop_owner
          // const first_name = name.split(' ')[0]
          // const last_name = name.split(' ')[1]
          // const { email, first_name, last_name } = response.data.associated_user;
          // let scopes = data.scope
          // let webhook = await this.createUninstallWebHook(shop, data.access_token) //create webhook function

          User.create({
            app_token: {
              shopify: data?.access_token,
            },
          })
            .then((newUser) => {
              if (newUser)
                return sendSuccessJSONResponse(res, {
                  message: "Succesfull login",
                });
              else
                return sendFailureJSONResponse(res, {
                  message: "Something went wrong",
                });
            })
            .catch(() => {
              return sendFailureJSONResponse(res, {
                message: "Something went wrong",
              });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        return sendFailureJSONResponse(res, {
          message: "Something went wrong",
        });
      });
  } catch (err) {
    console.log(err);
    return sendFailureJSONResponse(res, { message: "Something went wrong" });
  }
};

// exports.createProductCreateWebHook = async (shop, accessToken) => { // call this on installing shopify app
//     let uuid = crypto.randomUUID()
//     const registerWebhookOptions = {
//         method: 'POST',
//         url: `https://${shop}/admin/api/2023-04/webhooks.json?access_token=${accessToken}`,
//         data: {
//             webhook: {
//                 topic: 'products/create',
//                 address: `${serverUrl}app/shopify/auth/uninstallApp/${uuid}`, // address of route of your product create webhook
//                 format: 'json',
//             },
//         },
//     };

//     try {
//         await Axios(registerWebhookOptions);
//         console.log(`Successfully registered webhook`);
//     } catch (e) {
//         // Needed for UI test cases - if on non development instance then proceed
//         if (serverUrl !== 'http://localhost:8000') {
//             return res.status(400).send({
//                 message: `Failed to register webhook: ${e}`,
//                 success: false,
//             });
//         }
//     }
// }

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
  const themeLiquid = await ShopifyAPIAndMethod.getThemeLiquid(),
    htmlContent = themeLiquid?.value;

  const updateThemeContent = restoreResourceHints(htmlContent);
};

exports.minifyJavascriptCode = async (req, res, next) => {
  const themeAssets = await ShopifyAPIAndMethod.getAssets();
  const assets = themeAssets.assets;

  const cssAssets = assets.filter(
    (asset) => asset.content_type === "application/javascript"
  );

  return res.json({});

  function removeUnusedCodeFromHTML(html) {
    const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    const scriptTags = html.match(scriptRegex);
    if (!scriptTags) {
      console.log("No JavaScript code found in the HTML.");
      return html;
    }

    scriptTags.forEach((scriptTag) => {
      const jsRegex = /<script\b[^<]*>([\s\S]*?)<\/script>/i;
      const jsMatch = scriptTag.match(jsRegex);
      if (!jsMatch || !jsMatch[1]) return;

      const jsCode = jsMatch[1];
      const result = UglifyJS.minify(jsCode, {
        compress: {
          unused: true, // Remove unused code
        },
      });

      if (result.error) {
        console.error(result.error);
      } else {
        const updatedJsCode = result.code;
        html = html.replace(jsCode, updatedJsCode);
      }
    });

    return html;
  }

  const htmlString = `
      <html>
        <head>
          <script>
            function unusedFunction() {
              console.log('This function is not used.');
            }
            
            function usedFunction() {
              console.log('This function is used.');
            }
          </script>
        </head>
        <body>
          <h1>Hello, world!</h1>
        </body>
      </html>
      `;

  const updatedHtmlString = removeUnusedCodeFromHTML(htmlString);
  console.log(updatedHtmlString);
};

exports.removeUnusedJavascriptCode = async (req, res, next) => {
  const themeLiquid = await ShopifyAPIAndMethod.getThemeLiquid(),
    htmlContent = themeLiquid?.value;

  //     // console.log()
  //     const esprima = require('esprima');
  //     const estraverse = require('estraverse');
  //     const escodegen = require('escodegen');

  //     function removeUnusedCodeFromHTML(html) {
  //         const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  //         const scriptTags = html.match(scriptRegex);
  //         if (!scriptTags) {
  //             console.log("No JavaScript code found in the HTML.");
  //             return html;
  //         }

  //         scriptTags.forEach((scriptTag) => {
  //             const jsRegex = /<script\b[^<]*>([\s\S]*?)<\/script>/i;
  //             const jsMatch = scriptTag.match(jsRegex);
  //             if (!jsMatch || !jsMatch[1]) return;

  //             const jsCode = jsMatch[1];

  //             // Parse the JavaScript code
  //             const ast = esprima.parseScript(jsCode);

  //             // Find the function declarations
  //             const functionDeclarations = [];
  //             estraverse.traverse(ast, {
  //                 enter(node) {
  //                     if (node.type === 'FunctionDeclaration') {
  //                         functionDeclarations.push(node);
  //                     }
  //                 }
  //             });

  //             // Find the unused function names
  //             const usedFunctionNames = new Set();
  //             functionDeclarations.forEach((declaration) => {
  //                 const funcName = declaration.id.name;
  //                 const isUsed = new RegExp(`\\b${funcName}\\b`).test(html);
  //                 if (isUsed) {
  //                     usedFunctionNames.add(funcName);
  //                 }
  //             });

  //             // Remove the unused functions from the AST
  //             functionDeclarations.forEach((declaration) => {
  //                 const funcName = declaration.id.name;
  //                 if (!usedFunctionNames.has(funcName)) {
  //                     estraverse.replace(declaration, {
  //                         enter() {
  //                             return estraverse.VisitorOption.Remove;
  //                         }
  //                     });
  //                 }
  //             });

  //             // Generate the updated JavaScript code
  //             const updatedJsCode = escodegen.generate(ast);

  //             html = html.replace(jsCode, updatedJsCode);
  //         });

  //         return html;
  //     }

  //     const htmlString = `
  // <html>
  //   <head>
  //     <script>
  //       function unusedFunction() {
  //         console.log('This function is not used.');
  //       }

  //       function usedFunction() {
  //         console.log('This function is used.');
  //       }
  //     </script>
  //   </head>
  //   <body>
  //     <h1>Hello, world!</h1>
  //   </body>
  // </html>
  // `;

  //     const updatedHtmlString = removeUnusedCodeFromHTML(htmlString);
  //     console.log(updatedHtmlString);
};

exports.eliminateRenderBlockingResources = async (req, res, next) => {
  try {
    const themeLiquid = await ShopifyAPIAndMethod.getThemeLiquid(),
      htmlContent = themeLiquid?.value,
      updatedThemeLiquid = convertStylesheets(htmlContent);

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

// removing unused css code from index page
exports.removingUnusedCssFromIndexPage = async (req, res, next) => {
  const themeLiquid = await ShopifyAPIAndMethod.getThemeLiquid(),
    htmlContent = themeLiquid?.value;
};

exports.minifyPageContent = async (req, res, next) => {
  try {
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

  if (!compressionType)return sendFailureJSONResponse(res, {message: `please provide compression type`,});

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
        .then((response) => {})
        .catch((error) => {
          console.log(error);
        });
    }
  }

  return rsendSuccessJSONResponse(res, { message: `success` });
};

exports.fontOptimization = async (req, res, next) => {
  try {
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
  const products = await ShopifyAPIAndMethod.getAllProducts();

  for (let i = products.length - 1; i >= 0; i--) {
    console.log(`products[i]`, products[i]);
  }

  res.json(data);
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
