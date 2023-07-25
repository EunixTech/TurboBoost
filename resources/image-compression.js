const losslessCompression = async(imageBuffer, sharp) =>{
    try {
        const compressedImageBuffer = await sharp(imageBuffer)
          .webp({ lossless: true })
          .toBuffer();
   
        console.log(
          'Lossless Compression completed and saved as "lossless_compressed_image.webp".'
        );
        return compressedImageBuffer
      } catch (error) {
        console.error("Error during Lossless Compression:", error.message);
      }
}


module.exports ={
    losslessCompression
}