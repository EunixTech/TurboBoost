const router = require(`express`).Router(),
    controllers =  require("../../controllers/apps/shopify");

router.get("/app-installations", controllers.appInstallations);
router.get("/auth-callback", controllers.authCallback);

router.get("/fetch-product", controllers.fetchAllProduct);

router.get("/adding-lazy-loading", controllers.addingLazyLoadingScriptClient);

router.get("/updating-html-attributes", controllers.updatingHTMLAttribute);

router.get("/remove-unused-javascript-code", controllers.removeUnusedJavascriptCode);

module.exports = router;
    