
//Function to download the image from the given URL
 exports.downloadImage = async(Axios, imageURL)=> {
    try {
      const response = await Axios.get(imageURL, { responseType: "arraybuffer" });
      return response.data;
    } catch (error) {
      console.error("Error downloading the image:", error.message);
      // eslint-disable-next-line no-undef
      process.exit(1)
    }
}