const router = require(`express`).Router(),
    controllers = require("../../controllers/apps/slack")

router.post("/connect", controllers.connectSlack);


module.exports = router;