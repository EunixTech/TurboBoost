const router = require(`express`).Router();

const shopifyAppRoutes = require("./shopify");

router.use("/shopify", shopifyAppRoutes)

module.exports = router;