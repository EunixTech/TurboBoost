const losslessCompression = async(imageBuffer, sharp) =>{
    try {
        const compressedImageBuffer = await sharp(imageBuffer)
          .webp({ lossless: true })
          .toBuffer();
   
        console.log('Lossless Compression completed and saved as "lossless_compressed_image.webp".');
        return compressedImageBuffer
      } catch (error) {
        console.error("Error during Lossless Compression:", error.message);
      }
}

const lossyCompression = async(imageBuffer, sharp) =>{
    try {
        const compressedImageBuffer = await sharp(imageBuffer)
          .jpeg({ quality: 80 })
          .toBuffer();
        // console.log('Lossy Compression completed and saved as "lossy_compressed_image.jpg".');
        return compressedImageBuffer;
    } catch (error) {
        console.error("Error during Lossy Compression:", error.message);
    }
}

module.exports ={
    losslessCompression,
    lossyCompression
}