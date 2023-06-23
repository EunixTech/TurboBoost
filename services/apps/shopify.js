const Axios = require("axios");

const getShopDetails = async (shop, token) => {
    return new Promise((resolve,reject)=>{
      if(!shop||!token){
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
       
        resolve(response.data)
      })
      .catch((error) => {
        console.log(error)
        resolve({})
      });
    })
  
  
  }

  module.exports = {
    getShopDetails
  }
