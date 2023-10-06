exports.shopifyAuth = (req, res, next) => {
    var shopurl;
    var fa;
  
    if (req.query.shop !== "") {
      shopurl = req.query.shop;
  
      // fa = `frame-ancestors https://${shopurl} https://admin.shopify.com`;
      fa = `frame-ancestors 'none'`;
      res.setHeader("Content-Security-Policy", fa);
    }
    next();
  };
  