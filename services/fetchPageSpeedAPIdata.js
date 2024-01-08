const axios = require('axios')
const {
    PAGE_SPEED_API
} = process.env;

exports.fetchPageSpeedAPIdata = async(websiteURL = "") =>{
    try {
        const response = await axios.get('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://menehariya.netscapelabs.com/&category=best-practices&category=seo&category=performance&category=accessibility');
        const data = response.data;
        console.log("wroking2");
        console.log("wroking2", data);
        const lighthouseData = data.lighthouseResult;
        console.log("lighthouseData", lighthouseData);
        
        const metrics = {
            "First Contentful Paint": lighthouseData.audits['first-contentful-paint'].displayValue,
            "Speed Index": lighthouseData.audits['speed-index'].displayValue,
            "Total Blocking Time": lighthouseData.audits['total-blocking-time'].displayValue,
            "Largest Contentful Paint": lighthouseData.audits['largest-contentful-paint'].displayValue,
            "Performance": lighthouseData.categories.performance.score * 100,
            "Accessibility": lighthouseData.categories.accessibility.score * 100,
            "Best Practices": lighthouseData.categories['best-practices'].score * 100,
            "SEO": lighthouseData.categories.seo.score * 100,
        };
        // console.log(`metrics`, metrics);
        return metrics;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}
