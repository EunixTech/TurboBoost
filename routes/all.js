const router = require(`express`).Router();

const appsRoutes = require("./apps/_all"),
    adminRoutes = require("./admin/_all");
   
router.use(`/v1/api/apps`, appsRoutes);
router.use(`/v1/admin/`, adminRoutes);

module.exports = router;