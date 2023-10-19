const router = require(`express`).Router();
const shopifyAppRoutes = require("./shopify");
const klaviyoAppRoutes=require('./klaviyo')
const zapierAppRouted=require('./zapier')
const slackAppRouted=require('./slack')


router.use("/shopify", shopifyAppRoutes)

router.use('/klaviyo',klaviyoAppRoutes)

router.use('/zapier',zapierAppRouted)

router.use('/slack',slackAppRouted)

module.exports = router;