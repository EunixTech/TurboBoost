
//Function to download thconst e image from the given URL
const  downloadImage = async(Axios, imageURL)=> {
    try {
      const response = await Axios.get(imageURL, { responseType: "arraybuffer" });
      
     return  response?.data;
    } catch (error) {
      console.error("Error downloading the image:", error.message);
      // eslint-disable-next-line no-undef
      process.exit(1)
    }
}

module.exports = downloadImage