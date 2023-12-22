 exports.generateOTP = () => {
    // Define characters and numbers to be used in the OTP
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        
    // Initialize an empty string to store the OTP
    let otp = '';
  
    // Generate a 4-digit OTP
    for (let i = 0; i < 4; i++) {
      // Randomly select a character or number from the defined set
      const randomIndex = Math.floor(Math.random() * characters.length);
      otp += characters.charAt(randomIndex);
    }
  
    return otp;
}

