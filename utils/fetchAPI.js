/* eslint-disable no-undef */
exports.fetchAPI = (endpoint, method = "GET", data = null) => {

    const options = {
        headers: { "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN},
    };

    if (method === "PUT" && data) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(data);
    }

    return fetch(endpoint, options).then((res) => res.json());
};
