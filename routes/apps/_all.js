const router = require(`express`).Router();

const shopifyAppRoutes = require("./shopify");
const klaviyoAppRoutes=require('./klaviyo')
const zapierAppRouted=require('./zapier')

router.use("/shopify", shopifyAppRoutes)

router.use('/klaviyo',klaviyoAppRoutes)

router.use('/zapier',zapierAppRouted)

module.exports = router;