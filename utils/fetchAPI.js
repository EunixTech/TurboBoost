/* eslint-disable no-undef */
const fetchAPI = (endpoint, method = "GET", data = null) => {

    const options = {
        headers: { "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN },
        method: method,
    };

    if ((method === "PUT" || method === "POST") && data) {
        options.headers["Content-Type"] = "application/json";
        options.body = method === "PUT" ? JSON.stringify(data) : data;
    }

    // Modify data to be included as URL parameters for GET requests
    if (method === "GET" && data) {
        const queryString = new URLSearchParams(data).toString();
        endpoint += `?${queryString}`;
    }

    return fetch(endpoint, options).then((res) => res.json());

};

module.exports = fetchAPI;
