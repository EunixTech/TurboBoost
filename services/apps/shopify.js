/* eslint-disable no-useless-catch */
class ShopifyAdmin {
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
      headers: {
        "X-Shopify-Access-Token": this.accessToken,
      },
    };
    if (method === "PUT" && data) {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(data);
    }
    return fetch(`${this.url}/${endpoint}`, options).then((res) => res.json());
  }

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

  async makeBillingRequest(returnUrl) {
    try {
      return await fetch(`${this.url}/application_charges.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": this.accessToken,
        },
        body: JSON.stringify({
          application_charge: {
            name: "One time fee",
            price: 10.0,
            return_url: returnUrl,
          },
        }),
      }).then((res) => res.json());
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

  async getAppProducts() {
    try {
      const products = await fetch(
        `https://turboboost-dev.myshopify.com/admin/api/2023-07/products.json`,
        {
          headers: {
            "X-Shopify-Access-Token": "shpua_832b00f9f277821c02a70c5524402acd",
          },
        }
      ).then((res) => res.json());

      this.products = products.products;
      return this.products;
    } catch (e) {
      throw e;
    }
  }

  async updateProductImages() {
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
          id: "gid://shopify/ProductImage/41962190995736",
          src: "https://res.cloudinary.com/dq7iwl5ql/image/upload/v1687438446/DEV/aydtrwyqusblx3batcsi.png",
        },
        productId: "gid://shopify/Product/8406445752600",
      },
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://turboboost-dev.myshopify.com/admin/api/2023-04/graphql.json",
      headers: {
        "X-Shopify-Access-Token": "shpua_832b00f9f277821c02a70c5524402acd",
        "Content-Type": "application/json",
      },
      data: data,
    };

	const shop = await fetch(`https://${shopURL}/admin/shop.json`, {
        ...config
      }).then((res) => res.json());

	  return shop

    // Axios.request(config)
    //   .then((response) => {
    //     console.log(JSON.stringify(response.data));
    //     res.json("send");
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     res.json("send");
    //   });
  }
}

module.exports = ShopifyAdmin;
