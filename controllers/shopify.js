
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
  addDNSPrefetch = require("../resources/scripts/DNS-prefetch"),
  CheckFontFaceExists = require("../resources/scripts/checking-font-face"),
  addingFontDisplayInCss = require("../resources/scripts/add-font-display"),
  restoreResourceHints = require("../resources/scripts/restore-resource-hints"),
  convertStylesheets = require("../resources/scripts/convert-stylesheets"),
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
    SHOPIFY_API_KEY,
    SHOPIFY_API_SECRET,
    SHOPIFY_API_REDIRECT,
    SHOPIFY_API_SCOPES,
    SHOPIFY_BASE_URL,
  } = process.env;

const { googleApiDisplaySwap } = require("../utils/commenRegrex");

require("../utils/mongoose");

const sharp = require("sharp");

const {
  losslessCompression,
  lossyCompression,
} = require("../resources/image-compression");

const {
  generateForShop,
  uploadShopifySnippets,
} = require("../lib/shopify/critical-css/critical-css");

const parseThemeLiquid = require("../lib/shopify/critical-css/parseThemeLiquid");
const restoreThemeLiquid = require("../lib/shopify/critical-css/restoreThemeLiquid");

const ShopifyAPI = require("../services/apps/shopify");

const ShopifyAPIAndMethod = new ShopifyAPI({
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
  shop: process.env.SHOP,
  version: process.env.SHOPIFY_API_VERSION,
});
ShopifyAPIAndMethod.init();

const uploadToCloudinary = require("../utils/uploadToCloudinary");

const downloadImage = require("../resources/downloadImage");

const { createStorefrontClient, CachePolicy } = require("@shopify/hydrogen");
const { createInMemoryCache } = require("@envelop/response-cache");

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
      image: {
        altText: "test",
        id: "gid://shopify/ProductImage/41962191454488",
        src: "https://www.shutterstock.com/image-vector/example-red-square-grunge-stamp-260nw-327662909.jpg",
      },
      productId: "gid://shopify/Product/8406446014744",
    },
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://turboboost-dev.myshopify.com/admin/api/2023-04/graphql.json",
    headers: {
      "X-Shopify-Access-Token": "shpua_92e1118272f4b9fd9af36af7fd2ec2d2",
      "Content-Type": "application/json",
    },
    data: data,
  };

  Axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
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

exports.addingLazyLoadingScriptClient = async (req, res, next) => {

  const fetchConfig = getFetchConfig();

  Axios({
    ...fetchConfig,
    url: `https://turboboost-dev.myshopify.com/admin/api/2023-04/themes.json?role=main`,
  }).then(async (foundTheme) => {
    const themeId = foundTheme?.data?.themes[0]?.id;

    if (themeId) {
      const responseq = await Axios({
        ...fetchConfig,
        method: "PUT",
        url: `https://turboboost-dev.myshopify.com/admin/api/2023-01/themes/${themeId}/assets.json`,
        data: JSON.stringify({
          asset: {
            key: "sections/main-product.liquid",
            value:
              "{%- for media in product.media -%}\n <img\n  alt=\"{{ media.alt }}\"\n data-sizes=\"auto\"\n data-srcset=\"{{ media.preview_image | img_url: '275x' }} 275w,\n  {{ media.preview_image | img_url: '320x' }} 320w,\n {{ media.preview_image | img_url: '500x' }} 500w,\n                     {{ media.preview_image | img_url: '640x' }} 640w,\n                     {{ media.preview_image | img_url: '1024x' }} 1024w\"\n        data-src=\"{{ media.preview_image | img_url: '416x' }}\"\n        src=\"{{ media.preview_image | img_url: '275x' }}\"\n        class=\"lazyloadssssss-manmohan\" />\n{%- endfor -%}",
          },
        }),
      });
      const responseDatwa = responseq.data; // Extract the data from the response object
      console.log(responseDatwa);
    }
    res.json({
      themeId,
    });
  });
};

exports.updatingHTMLAttribute = (req, res, next) => {
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
      image: {
        altText: "test",
        id: "gid://shopify/ProductImage/41962191454488",
        src: "https://www.shutterstock.com/image-vector/example-red-square-grunge-stamp-260nw-327662909.jpg",
      },
      productId: "gid://shopify/Product/8406446014744",
    },
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://turboboost-dev.myshopify.com/admin/api/2023-04/graphql.json",
    headers: {
      "X-Shopify-Access-Token": "shpua_92e1118272f4b9fd9af36af7fd2ec2d2",
      "Content-Type": "application/json",
      Cookie:
        "__cf_bm=4SUrq29XCW4.ROWvgNsea_HYs4tpxw1hA1MqN_5016M-1687808384-0-AToLqgA5GmgslUR9bRyWh9X3U1/jWswRf2qbln1Qg7YZhPrH0njI6uY/nijxtVu1dhDjtdJh9Nde5SSbdLgXn4c=",
    },
    data: data,
  };

  Axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.minifyJavascriptCode = async (req, res, next) => {
  const themeAssets = await ShopifyAPIAndMethod.getAssets();
  const assets = themeAssets.assets;

  const cssAssets = assets.filter((asset) => asset.content_type === "application/javascript");

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

exports.removeUnusedJavascriptCode = (req, res) => {
  const fetchConfig = getFetchConfig();

  Axios({
    ...fetchConfig,
    url: `${SHOPIFY_BASE_URL}/themes.json?role=main`,
  }).then(async (foundTheme) => {
    const themeId = foundTheme?.data?.themes[0]?.id;

    if (themeId) {
      return res.json({
        themeId,
      });

      // const responseq = await Axios({
      //     ...fetchConfig,
      //     method: "PUT",
      //     url: `https://turboboost-dev.myshopify.com/admin/api/2023-01/themes/${themeId}/assets.json`,
      //     data: JSON.stringify({
      //         "asset": {
      //             "key": "sections/main-product.liquid",
      //             "value": "{%- for media in product.media -%}\n <img\n  alt=\"{{ media.alt }}\"\n        data-sizes=\"auto\"\n        data-srcset=\"{{ media.preview_image | img_url: '275x' }} 275w,\n                     {{ media.preview_image | img_url: '320x' }} 320w,\n {{ media.preview_image | img_url: '500x' }} 500w,\n                     {{ media.preview_image | img_url: '640x' }} 640w,\n                     {{ media.preview_image | img_url: '1024x' }} 1024w\"\n        data-src=\"{{ media.preview_image | img_url: '416x' }}\"\n        src=\"{{ media.preview_image | img_url: '275x' }}\"\n        class=\"lazyloadssssss-manmohan\" />\n{%- endfor -%}"
      //         }
      //     })

      // });
      // const responseDatwa = responseq.data; // Extract the data from the response object
      // console.log(responseDatwa)
    }
  });

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
  await ShopifyAPIAndMethod.init();

  const themeLiquid = await ShopifyAPIAndMethod.getThemeLiquid(),
    htmlContent = themeLiquid?.value,
    updatedThemeLiquid = convertStylesheets(htmlContent);

  const resposne = await ShopifyAPIAndMethod.writeAsset({
    name: "layout/theme.liquid",
    value: updatedThemeLiquid,
  });

  if (resposne) return sendSuccessJSONResponse(res, { message: "success" });
  else return sendFailureJSONResponse(res, { message: "something went right" });
};

exports.removingUnusedCSS = async (req, res) => {
  // getThemeAssets();

  // Example usage
  // getThemeAssets()
  const cssCode = `
      select option[disabled]{
      color: var(--red) !important;
      font-weight: bold !important
      }

  .required_field{
      color: var(--red);
  }

  @media only screen and (max-width: 749px) {
    .option_text {
        margin-bottom: 1.8rem;
        margin-top: 1rem
    }
    .option_text1{
      font-size: .9rem;
  }
  }
}

  .option_text{
    font-size: .9rem;
  }

  .option_text1 .option_text{
      font-size: .9rem;
  }`;

  const unusedCss = [".option_text", ".required_field"];

  // const modifiedCss = removeUnusedCss(cssCode, unusedCss);
  // console.log(modifiedCss);
  const dd = getThemeAssets();
  res.json({ dd });
  // const cssContent = `
  // select option[disabled] {
  //     color: var(--red) !important;
  //     font-weight: bold !important
  // }

  // .required_field {
  //     color: var(--red);
  // }

  // .option_text{
  //     font-size: .9rem;
  // }
  // `;

  // const unusedCss = [".option_text"];

  // const removeUnusedCSS = (cssContent, unusedCss) => {
  //   const modifiedContent = [];
  //   const lines = cssContent.split("\n");

  //   for (const line of lines) {
  //     let found = false;
  //     for (const selector of unusedCss) {
  //       if (line.includes(selector)) {
  //         found = true;
  //         break;
  //       }
  //     }

  //     if (!found) {
  //       modifiedContent.push(line);
  //     }
  //   }

  //   return modifiedContent.join("\n");
  // };

  // const modifiedContent = removeUnusedCSS(cssContent, unusedCss);

  // console.log(modifiedContent);
};

// fetching all assets or theme
async function getThemeAssets() {
  const fetchConfig = getFetchConfig();

  // Axios({
  //   ...fetchConfig,
  //   url: `https://turboboost-dev.myshopify.com/admin/api/2023-04/themes.json?role=main`,
  // }).then(async (foundTheme) => {
  //   const themeId = foundTheme?.data?.themes[0]?.id;

  //   if (themeId) {
  //     Axios({
  //       ...fetchConfig,
  //       url: `https://turboboost-dev.myshopify.com/admin/api/2023-07/themes/${themeId}/assets.json`,
  //     }).then(async (assests) => {
  //       const themeAssets = assests.data?.assets;

  //       const cssAssets = themeAssets.filter((asset) => asset.content_type === 'text/css');

  //       const cssAsset = cssAssets[0]; // Assuming you have only one CSS file
  //       const cssContent = cssAsset.value;
  //       console.log(`cssContent`, cssContent);
  //     });
  //   }
  // });

  // https://turboboost-dev.myshopify.com/index.json

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://turboboost-dev.myshopify.com/index.json",
    headers: {
      "X-Shopify-Access-Token": "shpua_832b00f9f277821c02a70c5524402acd",
    },
  };

  Axios.request(config)
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });

  // const response = await Axios.get(
  //   `https://cdn.shopify.com/s/files/1/0780/8001/6664/t/5/assets/section-password.css?v=1688552832`
  // );

  // const minifiedCSS = '.man{color:red}body{background:#fff}.container{width:100%;padding:10px}';
  // const beautifiedCSS = cssbeautify(response?.data);

  // console.log(`beautifiedCSS`, beautifiedCSS);
  // const beautifiedCSS = cssbeautify(minifiedCSS);

  // try {
  //   const response = await Axios.get(`getThemeAssets/admin/api/2021-07/themes/${themeId}/assets.json`, {
  //     auth: {
  //       username: apiKey,
  //       password: password,
  //     },
  //   });

  //   return response.data.assets;
  // } catch (error) {
  //   console.error('Error fetching theme assets:', error.message);
  //   return [];
  // }
}

// function removeUnusedCSS(cssContent, unusedSelectors) {
//   let modifiedContent = cssContent;

//   unusedSelectors.forEach((selector) => {
//     const regex = new RegExp(`\\b${selector}\\s*{[^}]*}`, 'g');
//     modifiedContent = modifiedContent.replace(regex, '');
//   });

//   return modifiedContent;
// }

// async function updateThemeAssets(updatedAssets) {
//   try {
//     const response = await axios.put(`https://${shopifyStoreDomain}/admin/api/2021-07/themes/${themeId}/assets.json`, {
//       asset: updatedAssets,
//     }, {
//       auth: {
//         username: apiKey,
//         password: password,
//       },
//     });

//     console.log('Theme assets updated successfully:', response.data.asset);
//   } catch (error) {
//     console.error('Error updating theme assets:', error.message);
//   }
// }

// async function main() {
//   try {
//     const themeAssets = await getThemeAssets();
//     const cssAssets = themeAssets.filter((asset) => asset.content_type === 'text/css');

//     if (cssAssets.length === 0) {
//       console.log('No CSS files found in the theme assets.');
//       return;
//     }

//     const cssAsset = cssAssets[0]; // Assuming you have only one CSS file
//     const cssContent = cssAsset.value;

//     // Collect and identify unused selectors
//     const usedSelectors = await getUsedSelectors();
//     const allSelectors = ['selector1', 'selector2', 'selector3', 'selector4', 'selector5']; // Replace with all selectors from your theme
//     const unusedSelectors = allSelectors.filter((selector) => !usedSelectors.includes(selector));

//     // Remove unused CSS rules
//     const modifiedCSS = removeUnusedCSS(cssContent, unusedSelectors);

//     // Update the theme assets
//     const updatedAssets = {
//       key: cssAsset.key,
//       value: modifiedCSS,
//     };

//     await updateThemeAssets(updatedAssets);
//   } catch (error) {
//     console.error('Error:', error.message);
//   }
// }

// main();

// const postcss = require('postcss');
// const selectorParser = require('postcss-selector-parser');

// function removeUnusedCSS(cssContent = '.man:{font:red} .man1:{font:red} .man2:{font:red} .man9:{font:red}', unusedSelectors = ['.man', '.man2', '.man4', '.man5', '.man6']) {

//   const ast = postcss.parse(cssContent);

//   ast.walkRules((rule) => {
//     const processedSelectors = [];

//     selectorParser((selectors) => {
//       selectors.walk((selector) => {
//         const isUnusedSelector = unusedSelectors.includes(selector.toString());

//         if (!isUnusedSelector) {
//           processedSelectors.push(selector);
//         }
//       });
//     }).processSync(rule.selector);

//     rule.selector = processedSelectors.map((selector) => selector.toString()).join(', ');
//   });

//   const modifiedContent = ast.toString();

//   console.log('modifiedContent:', modifiedContent);

//   return modifiedContent;
// }

// function removeUnusedCss(cssCode, unusedCss) {
//   // Create a regular expression pattern to match the selectors and their blocks
//   const pattern = new RegExp(
//     `(^|\\})\\s*(${unusedCss.join("|")})\\s*{[\\s\\S]*?\\}`,
//     "gm"
//   );

//   // Remove the matching CSS code
//   const modifiedCssCode = cssCode.replace(pattern, "");

//   return modifiedCssCode;
// }

// commenting unused css file(not completed yet)
function removeUnusedCss(cssCode, unusedCss) {
  // Create a regular expression pattern to match the selectors and their blocks
  const pattern = new RegExp(
    `(^|\\s|\\})(${unusedCss.join("|")})\\s*{[\\s\\S]*?\\}`,
    "gm"
  );

  // Comment out the matching CSS code
  const modifiedCssCode = cssCode.replace(pattern, "/* $2 {\n$3\n} */");

  return modifiedCssCode;
}

// getting home page html
async function getUsedSelectors() {
  try {
    const response = await Axios.get(
      `https://turboboost-dev.myshopify.com/index.json`,
      {
        auth: {
          username: "apiKey",
          password: "TurBoost@2023",
        },
      }
    );

    const html = response.data;
    const $ = Cheerio.load(`
    <nav class="menu-drawer__navigation">
    <ul class="menu-drawer__menu has-submenu list-menu" role="list"><li><a
              id="HeaderDrawer-home"
              href="/"
              class="menu-drawer__menu-item list-menu__item link link--text focus-inset"
            >
              Home
            </a></li><li><a
              id="HeaderDrawer-catalog"
              href="/collections/all"
              class="menu-drawer__menu-item list-menu__item link link--text focus-inset"
              
            >
              Catalog
            </a></li><li><a
              id="HeaderDrawer-contact"
              href="/pages/contact"
              class="menu-drawer__menu-item list-menu__item link link--text focus-inset"
              
            >
              Contact
            </a></li><li><a
              id="HeaderDrawer-testing"
              href="/pages/new-warranty"
              class="menu-drawer__menu-item list-menu__item link link--text focus-inset"
              
            >
              testing
            </a></li></ul>
  </nav>`);

    const usedSelectors = new Set();

    $("*").each(function () {
      const element = $(this);
      const elementClasses = element.attr("class");
      const elementIds = element.attr("id");

      if (elementClasses) {
        elementClasses
          .split(" ")
          .forEach((className) => usedSelectors.add(`.${className}`));
      }

      if (elementIds) {
        usedSelectors.add(`#${elementIds}`);
      }
    });

    console.log(`usedSelectors`, usedSelectors);

    return Array.from(usedSelectors);
  } catch (error) {
    console.error("Error fetching storefront:", error.message);
    return [];
  }
}

// removing unused css code from index page
exports.removingUnusedCssFromIndexPage = (req, res) => {
  const fetchConfig = getFetchConfig();

  // finding theme
  Axios({
    ...fetchConfig,
    url: `https://turboboost-dev.myshopify.com/admin/api/2023-04/themes.json?role=main`,
  }).then(async (foundTheme) => {
    const themeId = foundTheme?.data?.themes[0]?.id;

    // finding assets
    Axios({
      ...fetchConfig,
      url: `https://turboboost-dev.myshopify.com/admin/api/2023-04/themes/${themeId}/assets.json`,
    }).then(async (foundAssets) => {
      const { JSDOM } = require("jsdom");
      const css = require("css");

      const dom = new JSDOM(`
</style><style data-shopify>
.menu-drawer__utility-links
{
    font: red;
}

.demo:{
    qwdjhqwjdhgqj:qwdqw
}
#header {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .section-header {
    position: sticky; /* This is for fixing a Safari z-index issue. PR #2147 */
    margin-bottom: 18px;
  }

  @media screen and (min-width: 750px) {
    .section-header {
      margin-bottom: 24px;
    }
  }

  @media screen and (min-width: 990px) {
    .header {
      padding-top: 20px;
      padding-bottom: 20px;
    }
  }</style>

<header-drawer data-breakpoint="tablet">
  <details id="Details-menu-drawer-container" class="menu-drawer-container">
    <summary
      class="header__icon header__icon--menu header__icon--summary link focus-inset"
      aria-label="Menu"
    >
      <span>
        <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    class="icon icon-hamburger"
    fill="none"
    viewBox="0 0 18 16"
>
  <path d="M1 .5a.5.5 0 100 1h15.71a.5.5 0 000-1H1zM.5 8a.5.5 0 01.5-.5h15.71a.5.5 0 010 1H1A.5.5 0 01.5 8zm0 7a.5.5 0 01.5-.5h15.71a.5.5 0 010 1H1a.5.5 0 01-.5-.5z" fill="currentColor">
</svg>

        <svg
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
  focusable="false"
  class="icon icon-close"
  fill="none"
  viewBox="0 0 18 17"
>
  <path d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z" fill="currentColor">
</svg>

      </span>
    </summary>
    <div id="menu-drawer "  class="gradient menu-drawer motion-reduce">
      <div class="menu-drawer__inner-container">
        <div class="menu-drawer__navigation-container">
          <nav class="menu-drawer__navigation">
            <ul class="menu-drawer__menu has-submenu list-menu" role="list"><li><a
                      id="HeaderDrawer-home"
                      href="/"
                      class="menu-drawer__menu-item list-menu__item link link--text focus-inset menu-drawer__menu-item--active"
                      
                        aria-current="page"
                      
                    >
                      Home
                    </a></li><li><a
                      id="HeaderDrawer-catalog"
                      href="/collections/all"
                      class="menu-drawer__menu-item list-menu__item link link--text focus-inset"
                      
                    >
                      Catalog
                    </a></li><li><a
                      id="HeaderDrawer-contact"
                      href="/pages/contact"
                      class="menu-drawer__menu-item list-menu__item link link--text focus-inset"
                    >
                      Contact
                    </a></li><li><a
                      id="HeaderDrawer-testing"
                      href="/pages/new-warranty"
                      class="menu-drawer__menu-item list-menu__item link link--text focus-inset"
                      
                    >
                      testing
                    </a></li></ul>
          </nav>
          <div class="menu-drawer__utility-links demo"><ul class="list list-social list-unstyled" role="list"></ul>
          </div>
        </div>
      </div>
    </div>
  </details>
</header-drawer>
`);

      const doc = dom.window.document;
      const usedSelectors = [];
      const elements = doc.querySelectorAll("*");
      for (const element of elements) {
        const classList = Array.from(element.classList);
        const id = element.getAttribute("id");
        usedSelectors.push(...classList, `#${id}`); // Add # before the ID selector
      }

      // Remove unused CSS rules
      const stylesheets = doc.querySelectorAll("style");
      for (const stylesheet of stylesheets) {
        const ast = css.parse(stylesheet.textContent);
        const filteredRules = ast.stylesheet.rules.filter((rule) => {
          if (rule.type === "rule") {
            return rule.selectors.some((selector) => {
              if (selector.startsWith(".")) {
                // Match class selector
                const className = selector.slice(1);
                const regex = new RegExp(`^${className}$`, "i");
                return usedSelectors.some((usedSelector) =>
                  regex.test(usedSelector)
                );
              } else if (selector.startsWith("#")) {
                // Match ID selector
                const id = selector.slice(1);
                return usedSelectors.includes(`#${id}`);
              } else {
                // Match element selector
                return usedSelectors.includes(selector);
              }
            });
          }
          return true;
        });
        ast.stylesheet.rules = filteredRules;
        stylesheet.textContent = css.stringify(ast);
      }

      // Generate the modified HTML code without the unused CSS
      const modifiedHtmlCode = doc.documentElement.outerHTML;

      console.log(modifiedHtmlCode);

      console.log(foundAssets);
    });
  });

  res.json({
    dd: `working`,
  });
};

exports.minifyPageContent = (req, res) => {
  const fetchConfig = getFetchConfig();

  // finding theme
  Axios({
    ...fetchConfig,
    url: `https://turboboost-dev.myshopify.com/admin/api/2023-07/pages.json`,
  }).then(async (foundPages) => {
    const pages = foundPages?.data?.pages;

    if (pages?.length) {
      // minifyPageContent()
      for (let i = pages.length - 1; i >= 0; i--) {
        const pageContent = pages[i]?.body_html,
          pageId = pages[i]?.id;

        if (pageContent) {
          const minifiedPageContent = minifyPageContent(pageContent);
          console.log(pageContent);
          console.log(minifiedPageContent);

          let data = JSON.stringify({
            page: {
              id: pageId,
              body_html: minifiedPageContent,
            },
          });

          let config = {
            method: "put",
            maxBodyLength: Infinity,
            url: `https://turboboost-dev.myshopify.com/admin/api/2023-07/pages/${pageId}.json`,
            headers: {
              "X-Shopify-Access-Token":
                "shpua_832b00f9f277821c02a70c5524402acd",
              "Content-Type": "application/json",
            },
            data: data,
          };

          Axios.request(config)
            .then((response) => {
              console.log(response);

              if (response.status === 200) {
                res.json({
                  message: `success`,
                });
              }
              console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    }
  });
};

exports.DNSPrefetching = async (req, res, next) => {
  const themeLiquid = await ShopifyAPIAndMethod.getThemeLiquid(),
    htmlContent = themeLiquid?.value;

  await ShopifyAPIAndMethod.writeAsset({
    name: name,
    value: value,
  });

  // updating main theme page

  let data = JSON.stringify({
    asset: {
      key: "layout/theme.liquid",
      value:
        '<!doctype html> manmohan updated\n<html class="no-js" lang="{{ request.locale.iso_code }}">\n  <head>\n    <meta charset="utf-8">\n    <meta http-equiv="X-UA-Compatible" manmohan content="IE=edge">\n    <meta name="viewport" content="width=device-width,initial-scale=1">\n    <meta name="theme-color" content="">\n    <link rel="canonical" href="{{ canonical_url }}">\n\n    {%- if settings.favicon != blank -%}\n      <link rel="icon" type="image/png" href="{{ settings.favicon | image_url: width: 32, height: 32 }}">\n    {%- endif -%}\n\n    {%- unless settings.type_header_font.system? and settings.type_body_font.system? -%}\n      <link rel="preconnect" href="https://fonts.shopifycdn.com" crossorigin>\n    {%- endunless -%}\n\n    <title>\n      {{ page_title }}\n      {%- if current_tags %} &ndash; tagged "{{ current_tags | join: \', \' }}"{% endif -%}\n      {%- if current_page != 1 %} &ndash; Page {{ current_page }}{% endif -%}\n      {%- unless page_title contains shop.name %} &ndash; {{ shop.name }}{% endunless -%}\n    </title>\n\n    {% if page_description %}\n      <meta name="description" content="{{ page_description | escape }}">\n    {% endif %}\n\n    {% render \'meta-tags\' %}\n\n    <script src="{{ \'constants.js\' | asset_url }}" defer="defer"></script>\n    <script src="{{ \'pubsub.js\' | asset_url }}" defer="defer"></script>\n    <script src="{{ \'global.js\' | asset_url }}" defer="defer"></script>\n    {%- if settings.animations_reveal_on_scroll -%}\n      <script src="{{ \'animations.js\' | asset_url }}" defer="defer"></script>\n    {%- endif -%}\n\n    {{ content_for_header }} <!-- Add this line -->\n  </head>\n\n  <body class="gradient{% if settings.animations_hover_elements != \'none\' %} animate--hover-{{ settings.animations_hover_elements }}{% endif %}">\n    <a class="skip-to-content-link button visually-hidden" href="#MainContent">\n      {{ \'accessibility.skip_to_text\' | t }}\n    </a>\n\n    {%- if settings.cart_type == \'drawer\' -%}\n      {%- render \'cart-drawer\' -%}\n    {%- endif -%}\n\n    {% sections \'header-group\' %}\n\n    <main id="MainContent" class="content-for-layout focus-none" role="main" tabindex="-1">\n      {{ content_for_layout }} <!-- Add this line -->\n    </main>\n\n    {% sections \'footer-group\' %}\n\n    <ul hidden>\n      <li id="a11y-refresh-page-message">{{ \'accessibility.refresh_page\' | t }}</li>\n      <li id="a11y-new-window-message">{{ \'accessibility.link_messages.new_window\' | t }}</li>\n    </ul>\n\n    <script>\n      window.shopUrl = \'{{ request.origin }}\';\n      window.routes = {\n        cart_add_url: \'{{ routes.cart_add_url }}\',\n        cart_change_url: \'{{ routes.cart_change_url }}\',\n        cart_update_url: \'{{ routes.cart_update_url }}\',\n        cart_url: \'{{ routes.cart_url }}\',\n        predictive_search_url: \'{{ routes.predictive_search_url }}\',\n      };\n\n      window.cartStrings = {\n        error: `{{ \'sections.cart.cart_error\' | t }}`,\n        quantityError: `{{ \'sections.cart.cart_quantity_error_html\' | t: quantity: \'[quantity]\' }}`,\n      };\n\n      window.variantStrings = {\n        addToCart: `{{ \'products.product.add_to_cart\' | t }}`,\n        soldOut: `{{ \'products.product.sold_out\' | t }}`,\n        unavailable: `{{ \'products.product.unavailable\' | t }}`,\n        unavailable_with_option: `{{ \'products.product.value_unavailable\' | t: option_value: \'[value]\' }}`,\n      };\n\n      window.accessibilityStrings = {\n        imageAvailable: `{{ \'products.product.media.image_available\' | t: index: \'[index]\' }}`,\n        shareSuccess: `{{ \'general.share.success_message\' | t }}`,\n        pauseSlideshow: `{{ \'sections.slideshow.pause_slideshow\' | t }}`,\n        playSlideshow: `{{ \'sections.slideshow.play_slideshow\' | t }}`,\n      };\n    </script>\n\n    {%- if settings.predictive_search_enabled -%}\n      <script src="{{ \'predictive-search.js\' | asset_url }}" defer="defer"></script>\n    {%- endif -%}\n  </body>\n</html>\n',
    },
  });

  let config1 = {
    method: "put",
    maxBodyLength: Infinity,
    url: "https://turboboost-dev.myshopify.com/admin/api/2022-10/themes/152998740248/assets.json",
    headers: {
      "X-Shopify-Access-Token": "shpua_832b00f9f277821c02a70c5524402acd",
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios
    .request(config1)
    .then((response) => {
      console.log();
    })
    .catch((error) => {
      console.log(error);
    });
};

// image adaptions login
exports.imageSizeAdaptions = (req, res) => {
  const fetchConfig = getFetchConfig();

  const reponsiveImageLiquid = fs.readFileSync(
      "/Users/Dkr/Desktop/TurboBoost/resources/responsive-images/responsive-product-image.liquid",
      "utf8"
    ),
    reponsiveImageJavascripts = fs.readFileSync(
      "/Users/Dkr/Desktop/TurboBoost/resources/responsive-images/responsive-images.js",
      "utf8"
    );

  // creating new snippet
  const newAssetsData = JSON.stringify({
    asset: {
      key: "snippets/responsive-product-image.liquid",
      value: reponsiveImageLiquid,
    },
  });

  Axios({
    ...fetchConfig,
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
    url: "https://turboboost-dev.myshopify.com/admin/api/2022-10/themes/153666224408/assets.json",
    data: newAssetsData,
  }).then(async (newAssets) => {
    if (newAssets) {
      // creating new assets for javascript assets

      const newjavascriptAsset = JSON.stringify({
        asset: {
          key: "snippets/responsive-product-image.liquid",
          value: reponsiveImageJavascripts,
        },
      });

      await Axios({
        ...fetchConfig,
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        url: "https://turboboost-dev.myshopify.com/admin/api/2022-10/themes/153666224408/assets.json",
        data: newjavascriptAsset,
      });

      // getting  product card snippet content
      Axios({
        ...fetchConfig,
        url: `https://turboboost-dev.myshopify.com/admin/api/2023-04/themes/154354057496/assets.json?asset[key]=snippets/card-product.liquid`,
      }).then(async (foundAssets) => {
        console.log(`foundAssets`, foundAssets.data.asset.value);

        const productCard = ReplaceImagTag(foundAssets.data.asset.value);

        const data = JSON.stringify({
          asset: {
            key: "snippets/card-product.liquid",
            value: JSON.stringify(productCard),
          },
        });

        // update  product card snippet
        Axios({
          ...fetchConfig,
          headers: { "Content-Type": "application/json" },
          method: "PUT",
          url: "https://turboboost-dev.myshopify.com/admin/api/2022-10/themes/153666224408/assets.json",
          data: data,
        }).then(async (updatedProductCard) => {
          console.log(`data`, updatedProductCard);
          return res.json({
            data: "rend",
          });
        });
      });
    }
  });
};

exports.criticalCSS = async (req, res) => {
  //step1: generate critical css
  // step2: create new assets
  // step3: add assets link to theme
  // criticalCssGenerate();
  // return res.json({
  //   working: "fsdf",
  // });

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

// async function criticalCssGenerate(job, shopifyAdmin) {
//   try {
//     const pages = await generateForShop(shopifyAdmin, job);
//     await uploadShopifySnippets(shopifyAdmin, pages);
//     const failed = pages.filter((page) => page.error);
//     job.progress(80);
//     if (failed.length === 0) {
//       // Update theme.liquid
//       const themeLiquid = await shopifyAdmin.getThemeLiquid();
//       const updatedThemeLiquid = parseThemeLiquid(themeLiquid.value);
//       // Diff and Only write if different
//       await shopifyAdmin.writeAsset({
//         name: "layout/theme.liquid",
//         value: updatedThemeLiquid,
//       });
//       console.log("Updated layout/theme.liquid...");
//       job.progress(90);
//     }

//     // eslint-disable-next-line no-undef
//     const memUsed = process.memoryUsage().heapUsed / 1024 / 1024;
//     console.log(`Generating critical css used: ${memUsed}MB`);
//     return pages.map((page) => {
//       return {
//         type: page.type,
//         error: page.error,
//         success: !page.error,
//       };
//     });
//   } catch (e) {
//     throw e;
//   }
// }

exports.lossyImageCompression = async (req, res) => {
  const products = await ShopifyAPIAndMethod.fetchAllProducts();

  if (products?.length) {
    // console.log(`jhdjwghejwghe`);

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

exports.losslessImageCompression = async (req, res) => {
  // console.log(await performLosslessCompression(imageBuffer));
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

exports.losslessCompCollection = async (req, res, next) => {
  /* 
      1 = loassy compression
      2 = loassless compression
    */
  const compressionType = req?.query?.compressionType;

  if (!compressionType)
    return sendFailureJSONResponse(res, {
      message: `please provide compression type`,
    });

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

exports.cachingProductDetail = (req, res) => {};

exports.cachingThemeAssets = (req, res) => {
  Axios({
    ...fetchConfig,
    url: `https://turboboost-dev.myshopify.com/admin/api/2023-04/themes/154354057496/assets.json?asset[key]=layout/theme.liquid`,
  }).then(async (foundTheme) => {
    const theme = foundTheme?.data?.asset?.value;
    const updatedTheme = AssetsCaching(theme);

    // updating main theme page

    let data = JSON.stringify({
      asset: {
        key: "layout/theme.liquid",
        value: updatedTheme,
      },
    });

    let config1 = {
      method: "put",
      maxBodyLength: Infinity,
      url: "https://turboboost-dev.myshopify.com/admin/api/2022-10/themes/152998740248/assets.json",
      headers: {
        "X-Shopify-Access-Token": "shpua_832b00f9f277821c02a70c5524402acd",
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config1)
      .then((response) => {
        console.log();
      })
      .catch((error) => {
        console.log(error);
      });
  });
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
    console.log(`error`, error);
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
      function removeFontDisplay(cssContent) {
        return cssContent.replace(/(font-display\s*:\s*[^;]+;)/g, "");
      }

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

exports.restoreAdvancedLazyLoading = async(ewq, res, next) =>{
  res.json({ddd: "working"})
}

exports.restoreCriticalCss = async (req, res, next) => {
  await criticalCssRestore(shopifyAdmin, redisStore);
};

exports.restoreAdvancedLazyLoading = (req, res, next) =>{
  res.json("dasda")
}

/**
 * Turn OFF critical css for the shop
 * @param {Object} shopifyAdmin
 */
async function criticalCssRestore(shopifyAdmin, redisStore) {
  // const p = [];
  // p.push(shopifyAdmin.deleteAsset("snippets/critical-css.liquid"));
  // p.push(shopifyAdmin.deleteAsset("snippets/critical-css-index.liquid"));
  // p.push(shopifyAdmin.deleteAsset("snippets/critical-css-collection.liquid"));
  // p.push(shopifyAdmin.deleteAsset("snippets/critical-css-list-collections.liquid"));
  // p.push(shopifyAdmin.deleteAsset("snippets/critical-css-product.liquid"));
  // p.push(shopifyAdmin.deleteAsset("snippets/critical-css-blog.liquid"));
  // p.push(shopifyAdmin.deleteAsset("snippets/critical-css-article.liquid"));
  // p.push(shopifyAdmin.deleteAsset("snippets/critical-css-search.liquid"));
  // p.push(shopifyAdmin.deleteAsset("snippets/critical-css-page.liquid"));
  // await Promise.all(p);

  // const themeLiquid = await shopifyAdmin.getThemeLiquid();
  // const updatedThemeLiquid = await restoreThemeLiquid(themeLiquid.value, redisStore, shopifyAdmin.shop);
  // // Diff and Only write if different
  // await shopifyAdmin.writeAsset({
  //   name: 'layout/theme.liquid',
  //   value: updatedThemeLiquid
  // });

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

// Create cache strategies for product details, user data, and configuration data
const productCache = createInMemoryCache();
const userCache = createInMemoryCache();
const configCache = createInMemoryCache();

// Cache strategy for product details
const productCacheStrategy = {
  getProductFromCache: async (productId) => {
    return await productCache.get(`product-${productId}`);
  },
  setProductInCache: async (productId, product) => {
    await productCache.set(`product-${productId}`, product);
  },
  clearProductCache: async (productId) => {
    await productCache.delete(`product-${productId}`);
  },
};

// Cache strategy for user data
const userCacheStrategy = {
  getUserFromCache: async (userId) => {
    return await userCache.get(`user-${userId}`);
  },
  setUserInCache: async (userId, user) => {
    await userCache.set(`user-${userId}`, user);
  },
  clearUserCache: async (userId) => {
    await userCache.delete(`user-${userId}`);
  },
};

// Cache strategy for configuration data
const configCacheStrategy = {
  getConfigFromCache: async () => {
    return await configCache.get("config");
  },
  setConfigInCache: async (config) => {
    await configCache.set("config", config);
  },
  clearConfigCache: async () => {
    await configCache.delete("config");
  },
};

// Create the Storefront client with caching for all data types
async function createClientWithCaching() {
  const { storefront } = await createStorefrontClient({
    cache: {
      async get(request) {
        // Use the appropriate cache strategy based on the cache key
        if (request.key.startsWith("product-")) {
          return productCacheStrategy.getProductFromCache(request.key);
        } else if (request.key.startsWith("user-")) {
          return userCacheStrategy.getUserFromCache(request.key);
        } else if (request.key === "config") {
          return configCacheStrategy.getConfigFromCache();
        }
        // Add more cache strategies for other data types if needed
      },
      async set(request, response) {
        // Use the appropriate cache strategy based on the cache key
        if (request.key.startsWith("product-")) {
          await productCacheStrategy.setProductInCache(request.key, response);
        } else if (request.key.startsWith("user-")) {
          await userCacheStrategy.setUserInCache(request.key, response);
        } else if (request.key === "config") {
          await configCacheStrategy.setConfigInCache(response);
        }
        // Add more cache strategies for other data types if needed
      },
      async delete(request) {
        // Use the appropriate cache strategy based on the cache key
        if (request.key.startsWith("product-")) {
          await productCacheStrategy.clearProductCache(request.key);
        } else if (request.key.startsWith("user-")) {
          await userCacheStrategy.clearUserCache(request.key);
        } else if (request.key === "config") {
          await configCacheStrategy.clearConfigCache();
        }
        // Add more cache strategies for other data types if needed
      },
      // Cache policies for different queries...
    },
    // Other configuration options...
  });

  return storefront;
}

// Example usage:
async function fetchAndCacheData() {
  const client = await createClientWithCaching();

  // Fetch product details and cache the result
  const productResult = await client.query(/* ... */);
  await productCacheStrategy.setProductInCache("product-id-123", productResult);

  // Fetch user data and cache the result
  const userResult = await client.query(/* ... */);
  await userCacheStrategy.setUserInCache("user-id-456", userResult);

  // Fetch configuration data and cache the result
  const configResult = await client.query(/* ... */);
  await configCacheStrategy.setConfigInCache(configResult);
}

// // Example usage:
async function fetchDataFromCache() {
  const client = await createClientWithCaching();

  // Fetch product details from the cache
  const cachedProduct = await productCacheStrategy.getProductFromCache(
    "product-id-123"
  );
  console.log("Cached product:", cachedProduct);

  // Fetch user data from the cache
  const cachedUser = await userCacheStrategy.getUserFromCache("user-id-456");
  console.log("Cached user:", cachedUser);

  // Fetch configuration data from the cache
  const cachedConfig = await configCacheStrategy.getConfigFromCache();
  console.log("Cached config:", cachedConfig);
}
