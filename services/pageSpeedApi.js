const axios = require('axios')
const {
    PAGE_SPEED_API
} = process.env;

async function getPageSpeed(url) {
    try {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed
                ?url=${url}&
                category=PERFORMANCE&
                category=ACCESSIBILITY&
                category=BEST_PRACTICES&
                category=SEO&
                strategy=DESKTOP&
                key=${PAGE_SPEED_API}`,
        };

        let response = await axios.request(config)
        const lighthouseMetrics = response.data.lighthouseResults.audits;

        const fcpTime = lighthouseMetrics['first-contentful-paint'].displayValue;
        const speedIndex = lighthouseMetrics['speed-index'].displayValue;
        const totalBlockingTime = lighthouseMetrics['total-blocking-time'].displayValue;
        const largestContentfulPaint = lighthouseMetrics['largest-contentful-paint'].displayValue;

        const mainMetrics = response.data.lighthouseResults.categories;

        const performance = mainMetrics['performance']?.score
        const accessibility = mainMetrics['accessibility']?.score
        const bestPractices = mainMetrics['best-practices']?.score
        const seo = mainMetrics['seo']?.score

        return {
            fcpTime,
            speedIndex,
            totalBlockingTime,
            largestContentfulPaint,
            performance,
            accessibility,
            bestPractices, seo
        }

    } catch (e) {
        console.log(e)
        return null
    }


}

module.exports = {
    getPageSpeed
}