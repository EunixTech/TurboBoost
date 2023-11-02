const axios = require('axios')
const {
    PAGE_SPEED_API
} = process.env;

exports.fetchPageSpeedAPIdata = async(websiteURL = "") =>{
    try {
        axios.get('https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed', {
            params: {
              url: "https://spokeherd.com/?is-logged-in=false",
              key: PAGE_SPEED_API,
              category: ['PERFORMANCE', 'ACCESSIBILITY', 'BEST_PRACTICES', 'SEO'], // Specify the categories
              strategy: 'desktop', // Specify the strategy as 'desktop'
            }
          })
          .then(response => {
            const data = response.data;
            console.log(`data`,data)
            // const lighthouseData = data.lighthouseResult;
        
            // // Extract the desired metrics
            // const metrics = {
            //   "First Contentful Paint": lighthouseData.audits['first-contentful-paint'].displayValue,
            //   "Speed Index": lighthouseData.audits['speed-index'].displayValue,
            //   "Total Blocking Time": lighthouseData.audits['total-blocking-time'].displayValue,
            //   "Largest Contentful Paint": lighthouseData.audits['largest-contentful-paint'].displayValue,
            // //   "Performance": lighthouseData.categories.performance.score * 100,
            // //   "Accessibility": lighthouseData.categories.accessibility.score * 100,
            // //   "Best Practices": lighthouseData.categories['best-practices'].score * 100,
            // //   "SEO": lighthouseData.categories.seo.score * 100,
            // };

            const performanceScore = data.lighthouseResult.categories.performance.score * 100; // Performance
            // const accessibilityScore = data.categories.accessibility.score * 100; // Accessibility
            // const bestPracticesScore = data.categories.best-practices.score * 100; // Best Practices
            // const seoScore = data.categories.seo.score * 100; // SEO
        
            // console.log('Performance Score:', performanceScore);
            // console.log('Accessibility Score:', accessibilityScore);
            // console.log('Best Practices Score:', bestPracticesScore);
            // console.log('SEO Score:', seoScore);

            console.log(`wwwewewew`,performanceScore)
        
            // console.log(metrics);
            
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          })
    } catch (e) {
        console.log(e)
        return null
    }
}
