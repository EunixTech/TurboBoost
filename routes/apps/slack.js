const router = require(`express`).Router(),
    controllers = require("../../controllers/slack")

router.post("/connect", controllers.connectSlack);


module.exports = router;