
const fetchReqConfig = {
    method: 'GET',
    headers: {
        "Content-Type":"application/json",
        'X-Shopify-Access-Token': 'shpua_832b00f9f277821c02a70c5524402acd'
    }
};

exports.getFetchConfig=()=>{
    return fetchReqConfig;
};
