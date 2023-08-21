/* eslint-disable no-useless-catch */
const fetchAPI = require("../../utils/fetchAPI");

class ShopifyAPI {
  constructor({ shop, accessToken, version }) {
    if (!shop || !accessToken || !version) {
      throw new Error(
        "Cannot initialise ShopifyAdmin. Required parameter missing"
      );
    }
    this.shop = shop;
    this.accessToken = accessToken;
    this.assets = {};
    this.version = version;
    this.url = `https://${this.shop}/admin/api/${this.version}`;
  }

  // fetch(endpoint, method = "GET", data = null) {

  //     const options = {
  //         headers: {
  //         "X-Shopify-Access-Token": this.accessToken,
  //         },
  //     };

  //     if (method === "PUT" && data) {
  //         options.headers["Content-Type"] = "application/json";
  //         options.body = JSON.stringify(data);
  //     }
  //     return fetch(`${this.url}/${endpoint}`, options).then((res) => res.json());
  // }

  async init() {
    try {
      console.log("accessToken in init()", this.accessToken);
      console.log("this.url", this.url);

      const themesRes = await fetch(`${this.url}/themes.json`, {
        headers: {
          "X-Shopify-Access-Token": this.accessToken,
        },
      }).then((res) => res.json());

      if (themesRes.errors) {
        throw new Error(themesRes.errors);
      }

      const mainThemeArr = themesRes.themes.filter((t) => t.role === "main");
      const mainTheme = mainThemeArr.length === 1 ? mainThemeArr[0] : null;

      if (!mainTheme) {
        throw new Error("Could not get current theme id");
      }

      this.themeId = mainTheme.id;
    } catch (e) {
      throw e;
    }
  }

  async getThemeLiquid() {

    if (this.assets.theme) {
      return this.assets.theme;
    }

    try {
      const themeLiquid = await fetch(`${this.url}/themes/${this.themeId}/assets.json?asset[key]=layout/theme.liquid`,
        {
          headers: {
            "X-Shopify-Access-Token": this.accessToken,
          },
        }
      ).then((res) => res.json());

      this.assets.theme = themeLiquid.asset;
      return this.assets.theme;

    } catch (e) {
      throw e;
    }
  }

  async writeAsset({ name, value }) {
    try {
      const res = await fetch(
        `${this.url}/themes/${this.themeId}/assets.json`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": this.accessToken,
          },
          body: JSON.stringify({
            asset: {
              key: name,
              value: value,
            },
          }),
        }
      );
      const resJson = await res.json();

      if (resJson.errors) {
        throw new Error(JSON.stringify(resJson.errors));
      }
      return true;
    } catch (e) {
      throw e;
    }
  }

  async deleteAsset(assetKey) {
    try {
      await fetch(
        `${this.url}/themes/${this.themeId}/assets.json?asset[key]=${assetKey}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": this.accessToken,
          },
        }
      ).then((res) => res.json());
      return true;
    } catch (e) {
      throw e;
    }
  }

  async getShopDetails(shopURL) {
    try {
      const shop = await fetch(`https://${shopURL}/admin/shop.json`, {
        headers: {
          "X-Shopify-Access-Token": this.accessToken,
        },
      }).then((res) => res.json());

      this.shop = shop.data;
      return this.shop;
    } catch (e) {
      throw e;
    }
  }

  async fetchAllProducts() {
    console.log(`this.url`,this.url)
    try {
      const jsonRes = await fetch(`https://turboboost-dev.myshopify.com/admin/api/2023-07/products.json`, {
        headers: { "X-Shopify-Access-Token": this.accessToken },
      }).then((res) => res.json());

      this.products = jsonRes.products;
      return this.products;
    } catch (e) {
      throw e;
    }
  }


  async fetchSmartCollection() {
   
    try {
      const jsonRes = await fetch(`https://turboboost-dev.myshopify.com/admin/api/2023-07/smart_collections.json`, {
        headers: { "X-Shopify-Access-Token": this.accessToken },
      }).then((res) => res.json());
      
      return jsonRes?.smart_collections
    } catch (e) {
      throw e;
    }
  }

  async updateProductImages(productId = "", imageId = "", imageURL = "") {

    const data = JSON.stringify({
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
          id: `gid://shopify/ProductImage/${imageId}`,
          src: imageURL,
        },
        productId: `gid://shopify/Product/${productId}`,
      },
    });

    return fetchAPI(
      `${this.url}/graphql.json`,
      "POST",
      data,
    );
  }
}

module.exports = ShopifyAPI;
