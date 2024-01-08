const router = require(`express`).Router();

const appsRoutes = require("./apps/_all"),
    adminRoutes = require("./admin/_all"),
    shopifyRoutes =  require("./shopify"),
    dashboardRoutes = require("./admin/dashboard"),
    userRoutes = require("./user");
   
router.use(`/v1/api/apps`, appsRoutes);
router.use(`/v1/api/shopify`, shopifyRoutes);
router.use(`/v1/admin`, adminRoutes);
router.use(`/v1/user`, userRoutes);
router.use(`/v1`, dashboardRoutes);

module.exports = router;