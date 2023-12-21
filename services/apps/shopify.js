const fetchAPI = require("../../utils/fetchAPI");
const Axios = require("axios");
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

  fetch(endpoint, method = "GET", data = null) {
    const options = {
      headers: { "X-Shopify-Access-Token": this.accessToken },
    };

    if (method === "PUT" && data) {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(data);
    }
    return fetch(`${this.url}/${endpoint}`, options).then((res) => res.json());
  }

  async init() {
    try {
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
      console.log(e)
      throw e;
    }
  }

  async getThemeLiquid() {
    if (this.assets.theme) {
      return this.assets.theme;
    }

    try {
      const themeLiquid = await fetch(
        `${this.url}/themes/${this.themeId}/assets.json?asset[key]=layout/theme.liquid`,
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

  async getAssetByName(assetName) {
    try {
      const jsonRes = await fetch(
        `${this.url}/themes/${this.themeId}/assets.json?asset[key]=${assetName}`,
        {
          headers: {
            "X-Shopify-Access-Token": this.accessToken,
          },
        }
      ).then((res) => res.json());

      this.assets.theme = jsonRes.asset;
      return this.assets.theme;
    } catch (e) {
      throw e;
    }
  }

  async getAssets() {
    try {
      const res = await fetch(
        `${this.url}/themes/${this.themeId}/assets.json`,
        {
          method: "GET",
          headers: { "X-Shopify-Access-Token": this.accessToken },
        }
      );

      const resJson = await res.json();

      if (resJson.errors) {
        throw new Error(JSON.stringify(resJson.errors));
      }
      return resJson;
    } catch (e) {
      throw e;
    }
  }



  async writeAsset({ name, value }) {
    try {
      const res = await fetch(`${this.url}/themes/${this.themeId}/assets.json`, {
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
      });
      const resJson = await res.json();

      if (resJson.errors) {
        throw new Error(JSON.stringify(resJson.errors));
      }
      return true;
    } catch (e) {
      console.log(`Error occurred while writing asset:`, e);
      return false;
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

  async getAllPages() {

    try {
      const res = await fetch(
        `${this.url}/pages.json`,
        {
          method: "GET",
          headers: { "X-Shopify-Access-Token": this.accessToken },
        }
      );

      const resJson = await res.json();

      if (resJson.errors) {
        throw new Error(JSON.stringify(resJson.errors));
      }
      return resJson?.pages;
    } catch (e) {
      throw e;
    }
  }

  async updatePageContent({ pageId, htmlContent }) {

    try {
      const res = await fetch(`${this.url}/pages/${pageId}.json`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": this.accessToken,
        },
        body: JSON.stringify({
          page: {
            id: pageId,
            body_html: htmlContent,
          },
        }),
      });

      const resJson = await res.json();

      if (resJson.errors) {
        throw new Error(JSON.stringify(resJson.errors));
      }
      return true;

    } catch (e) {
      throw e;
    }
  }

  async updatePageContent({ pageId, htmlContent }) {

    try {
      const res = await fetch(`${this.url}/pages/${pageId}.json`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": this.accessToken,
        },
        body: JSON.stringify({
          page: {
            id: pageId,
            body_html: htmlContent,
          },
        }),
      });

      const resJson = await res.json();

      if (resJson.errors) {
        throw new Error(JSON.stringify(resJson.errors));
      }
      return true;

    } catch (e) {
      throw e;
    }
  }



  async getAllProducts() {

    try {
      const res = await fetch(
        `${this.url}/products.json`,
        {
          method: "GET",
          headers: { "X-Shopify-Access-Token": this.accessToken },
        }
      );

      const resJson = await res.json();

      if (resJson.errors) {
        throw new Error(JSON.stringify(resJson.errors));
      }
      return resJson?.products;
    } catch (e) {
      throw e;
    }
  }

  async getAllProductImages(productId) {

    try {
      const res = await fetch(
        `${this.url}/products/${productId}/images.json`,
        {
          method: "GET",
          headers: { "X-Shopify-Access-Token": this.accessToken },
        }
      );

      const resJson = await res.json();

      if (resJson.errors) {
        throw new Error(JSON.stringify(resJson.errors));
      }
      return resJson?.images;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Get shop details.
   * @param {string} shopURL - The shop URL.
   * @return {Promise} The shop details.
   */
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

  /**
   * Fetch all products.
   * @return {Promise} The products.
   */
  async fetchAllProducts() {
    try {
      const jsonRes = await fetch(
        `https://turboboost-dev.myshopify.com/admin/api/2023-07/products.json`,
        {
          headers: { "X-Shopify-Access-Token": this.accessToken },
        }
      ).then((res) => res.json());

      this.products = jsonRes.products;
      return this.products;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Fetch smart collection.
   * @return {Promise} The smart collections.
   */
  async fetchSmartCollection() {
    try {
      const jsonRes = await fetch(
        `https://turboboost-dev.myshopify.com/admin/api/2023-07/smart_collections.json`,
        {
          headers: { "X-Shopify-Access-Token": this.accessToken },
        }
      ).then((res) => res.json());

      return jsonRes?.smart_collections;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Update product images.
   * @param {string} productId - The product ID.
   * @param {string} imageId - The image ID.
   * @param {string} imageURL - The image URL.
   * @return {Promise} The response data.
   */
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

    return fetchAPI(`${this.url}/graphql.json`, "POST", data);
  }



  async getShopDetails(shop, token) {
    return new Promise((resolve, reject) => {
      if (!shop || !token) {
        reject("Shop and token are required for shop details")
      }

      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://${shop}/admin/shop.json`,
        headers: {
          'X-Shopify-Access-Token': token,
        }
      };

      Axios.request(config)
        .then((response) => {
          // console.log(JSON.stringify(response.data));
          resolve(response.data)
        })
        .catch((error) => {
          console.log(error)
          resolve({})
        });
    })


  }
}

module.exports = ShopifyAPI;

