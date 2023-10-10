const router = require(`express`).Router();

const shopifyAppRoutes = require("./shopify");
const klaviyoAppRoutes=require('./klaviyo')

router.use("/shopify", shopifyAppRoutes)

router.use('/klaviyo',klaviyoAppRoutes)

module.exports = router;