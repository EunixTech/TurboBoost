const router = require(`express`).Router();
const klaviyoAppRoutes=require('./klaviyo')
const zapierAppRouted=require('./zapier')
const slackAppRouted=require('./slack')


router.use('/klaviyo',klaviyoAppRoutes)

router.use('/zapier',zapierAppRouted)

router.use('/slack',slackAppRouted)

module.exports = router;