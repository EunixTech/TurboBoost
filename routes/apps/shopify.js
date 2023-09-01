const router = require(`express`).Router(),
  controllers = require("../../controllers/shopify");

router.get("/app-installations", controllers.appInstallations);

router.get("/auth-callback", controllers.authCallback);

router.get("/fetch-product", controllers.fetchAllProduct);

router.get("/adding-lazy-loading", controllers.addingLazyLoading);

router.get("/updating-html-attributes", controllers.updatingHTMLAttribute);

router.get("/remove-unused-javascript-code", controllers.removeUnusedJavascriptCode);

router.get("/remove-unused-css-code", controllers.removingUnusedCSS);

router.get("/remove-unused-css-index-page", controllers.removingUnusedCssFromIndexPage);

router.get("/minify-javascript-code", controllers.minifyJavascriptCode);

router.get("/minify-page-content", controllers.minifyPageContent);

router.get("/eliminate-render-blocking-resources", controllers.eliminateRenderBlockingResources);

router.get("/adding-dns-prefetch", controllers.DNSPrefetching);

router.get("/font-optimization", controllers.fontOptimization);

router.get("/image-size-adaptions", controllers.imageSizeAdaptions);

router.get("/critical-css", controllers.criticalCSS);

router.get("/lossy-image-compression", controllers.lossyImageCompression);

router.get("/lossless-image-compression", controllers.losslessImageCompression);

router.get("/lossless-comp-collection-image", controllers.losslessCompCollection);

router.get("/caching-theme-assets", controllers.cachingThemeAssets);

router.get("/delay-google-font", controllers.delayingGoogleFont);

router.post("/adding-google-tag-manager", controllers.addingGoogleTagManager);

router.get("/restore-critical-css", controllers.restoreCriticalCss);

router.get("/restore-font-optimization", controllers.restoringFontOptimization);

router.get("/restore-google-font-delay", controllers.restoreGoogleFontDelay);

router.get("/restore-dns-prefetch", controllers.restoreDNSPrefetching);

router.get("/restore-advanced-lazy-loading", controllers.restoreAdvancedLazyLoading);

router.get("/restore-restore-image-adaption", controllers.restoreImageSizeAdaption);

router.get("/restore-image-compression", controllers.restoreImageCompression);


module.exports = router;
