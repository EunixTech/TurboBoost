const router = require(`express`).Router();

const apiRoutes = require("./api/_all"),
    adminRoutes = require("./admin/_all");
   
router.use(`/v1/api/`, apiRoutes);
router.use(`/v1/admin/`, adminRoutes);

module.exports = router;