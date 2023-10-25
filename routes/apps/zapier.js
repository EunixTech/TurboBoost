const router = require(`express`).Router(),
    controllers = require("../../controllers/apps/zapier")

router.post("/connect", controllers.connectZapier);


module.exports = router;