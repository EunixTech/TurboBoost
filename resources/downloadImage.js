
//Function to download thconst e image from the given URL
const  downloadImage = async(Axios, imageURL)=> {
    try {
      const response = await Axios.get("https://res.cloudinary.com/dq7iwl5ql/image/upload/v1686655308/DEV/tmptetjklrjsgctzep72.png", { responseType: "arraybuffer" });

     const blob =   new Blob([response.data], { type: 'image/jpeg' });
     return  response?.data;
    } catch (error) {
      console.error("Error downloading the image:", error.message);
      // eslint-disable-next-line no-undef
      process.exit(1)
    }
}

module.exports = downloadImage