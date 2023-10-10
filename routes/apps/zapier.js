const router = require(`express`).Router(),
    controllers = require("../../controllers/zapier")

router.post("/connect", controllers.connectZapier);


module.exports = router;