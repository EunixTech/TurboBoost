const mongoose = require("mongoose");
const {fetchPageSpeedAPIdata} =  require("../../services/fetchPageSpeedAPIdata")
const axios = require('axios');

const {
    sendSuccessJSONResponse,
    sendFailureJSONResponse,
    sendErrorJSONResponse,
} = require("../../handlers/jsonResponseHandlers.js");

exports.fetchGoogleSpeedScoreData = async (req, res, next) => {
    
    const userId = req.userId;

    // try {
        //   const response = await axios.get(
        //     `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://www.spokehub.in/&category=best-practices&category=seo&category=performance&category=accessibility&strategy=mobile`
        //   );
       
        
      
        //   const mobileData = {
        //       performanceScore: response?.data.lighthouseResult.categories.performance.score * 100,
        //       FCP: response?.data.lighthouseResult.audits['first-contentful-paint'].displayValue,
        //       LCP: response?.data.lighthouseResult.audits['largest-contentful-paint'].displayValue,
        //       CLS: response?.data.lighthouseResult.audits['cumulative-layout-shift'].displayValue,
        //     //   FID: response?.data.lighthouseResult.audits['first-input-delay'].displayValue,
        //       INP: response?.data.lighthouseResult.audits['interactive'].displayValue,
        //     //   TTFB: response?.data.lighthouseResult.audits['time-to-first-byte'].displayValue,
        //       speedIndex: response?.data.lighthouseResult.audits['speed-index'].displayValue,
        //       TBT: response?.data.lighthouseResult.audits['total-blocking-time'].displayValue,
        //       pageLoadTime: response?.data.lighthouseResult.audits['page-load-time'].displayValue,
        //       TTI: response?.data.lighthouseResult.audits['interactive'].displayValue,
        //       imageData: response?.data.lighthouseResult.audits['image-data'].displayValue,
        //   };
        // const desktopResponse = await axios.get(
        //     `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://www.spokehub.in/&category=best-practices&category=seo&category=performance&category=accessibility&strategy=desktop`
        //   );
        //   const desktopData = {
        //       performanceScore: desktopResponse?.data.lighthouseResult.categories.performance.score * 100,
        //       FCP: desktopResponse?.data.lighthouseResult.audits['first-contentful-paint'].displayValue,
        //       LCP: desktopResponse?.data.lighthouseResult.audits['largest-contentful-paint'].displayValue,
        //       CLS: desktopResponse?.data.lighthouseResult.audits['cumulative-layout-shift'].displayValue,
        //     //   FID: desktopResponse?.data.lighthouseResult.audits['first-input-delay'].displayValue,
        //       INP: desktopResponse?.data.lighthouseResult.audits['interactive'].displayValue,
        //     //   TTFB: desktopResponse?.data.lighthouseResult.audits['time-to-first-byte'].displayValue,
        //       speedIndex: desktopResponse?.data.lighthouseResult.audits['speed-index'].displayValue,
        //       TBT: desktopResponse?.data.lighthouseResult.audits['total-blocking-time'].displayValue,
        //     //   pageLoadTime: desktopResponse?.data.lighthouseResult.audits['page-load-time'].displayValue,
        //       TTI: desktopResponse?.data.lighthouseResult.audits['interactive'].displayValue,
        //     //   imageData: desktopResponse?.data.lighthouseResult.audits['image-data'].displayValue,
        //   };

        // //   console.log("mobileData",mobileData)
        //   console.log("desktopData",desktopData)
     
    //   const lighthouseData = data.lighthouseResult;
    //   console.log("lighthouseData", lighthouseData);

    

    //     return sendSuccessJSONResponse(res, { message:"successfull" });
    // } catch (error) {
    //     console.log(error)
    //     return sendErrorJSONResponse(res, { message: "Error fetching data" });
    // }

    try {
        const desktopResponse = await axios.get(
          `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://spokeherd.com/?is-logged-in=false/&category=best-practices&category=seo&category=performance&category=accessibility&category=CATEGORY_UNSPECIFIED&strategy=desktop`
        );
      
        const lighthouseResult = desktopResponse?.data?.lighthouseResult;
      
        if (lighthouseResult) {
          // const desktopData = {
          //   performanceScore: lighthouseResult.categories.performance.score * 100,
          //   FCP: lighthouseResult.audits['first-contentful-paint'].displayValue,
          //   LCP: lighthouseResult.audits['largest-contentful-paint'].displayValue,
          //   CLS: lighthouseResult.audits['cumulative-layout-shift'].displayValue,
          //   // FID: lighthouseResult.audits['first-input-delay'].displayValue,
          //   // INP: lighthouseResult.audits['input-timing'].displayValue, // Change to the correct audit for Input Timing
          //   // TTFB: lighthouseResult.audits['time-to-first-byte'].displayValue,
          //   speedIndex: lighthouseResult.audits['speed-index'].displayValue,
          //   TBT: lighthouseResult.audits['total-blocking-time'].displayValue,
          //   // pageLoadTime: lighthouseResult.audits['page-load-time'].displayValue,
          //   TTI: lighthouseResult.audits['interactive'].displayValue,
          //   imageData: lighthouseResult.audits['screenshot-thumbnails'],
          //   finalScreenshot: lighthouseResult.audits['final-screenshot']?.details?.data,
          // };
          console.log(desktopResponse?.data,"desktopResponse")

          console.log("json.loadingExperience.metrics.FIRST_INPUT_DELAY_MS.category", desktopResponse.loadingExperience)
      
          // Use desktopData as needed
          // console.log(desktopData);
        } else {
          console.error('Invalid response structure');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      

}

exports.updateGoogleSpeedScore = (req, res, next) =>{
    const userId = req.userId;


}

