const router = require(`express`).Router(),
    controllers = require("../../controllers/apps/klaviyo")

router.post("/connect", controllers.connectKlaviyo);


module.exports = router;