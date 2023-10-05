/* eslint-disable no-undef */

const fetchReqConfig = {
    method: 'GET',
    headers: {
        "Content-Type":"application/json",
        'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN
    }
};

exports.getFetchConfig=()=>{ return fetchReqConfig };


