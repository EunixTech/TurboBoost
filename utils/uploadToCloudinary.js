/* eslint-disable no-undef */
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your account details
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key:  process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadImageToCloudinary(bufferImageData, options = {}) {
    try {
      // Convert Buffer to base64-encoded string
      const base64Image = bufferImageData.toString('base64');

      // Uploading image to Cloudinary
      const result = await cloudinary.uploader.upload(
          `data:image/jpeg;base64,${base64Image}`,
          { 
              resource_type: 'auto', // Automatically detect resource type (image, video, raw, etc.)
              ...options // Additional upload options, e.g., public_id, folder, etc.
          }
      );

      return result;
     
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error.message);
        throw error;
    }
}

module.exports = uploadImageToCloudinary
