const router = require(`express`).Router(),
    controllers = require("../../controllers/klaviyo")

router.post("/connect", controllers.connectKlaviyo);


module.exports = router;