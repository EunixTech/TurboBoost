const axios = require('axios')
const {
    PAGE_SPEED_API
} = process.env;

exports.fetchPageSpeedAPIdata = async(websiteURL = "") =>{
    try {
        axios.get('https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed', {
            params: {
              url: 'https://tdiinfratech.com',
              key: 'PAGE_SPEED_API'
            }
          })
            .then(response => {
                console.log("working")
              // Handle successful response
              console.log(response.data.loadingExperience.metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE);
            })
            .catch(error => {
              // Handle error response
              if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
              } else {
                console.log(error.message);
              }
            });

    } catch (e) {
        console.log(e)
        return null
    }
}
