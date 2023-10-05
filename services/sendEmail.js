const nodemailer = require('nodemailer');

const sendEmail = async (reciverEmail = "" ,HTMlContent = "", heading = "") => {

    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user:process.env.NODEMAIL_EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        }
      });
      
      let emailConfig = {
        from: process.env.SENDER_EMAIL_ADDRESS,
        to: reciverEmail,
        subject: heading,
        html: HTMlContent
      };
      
      try {
        await mailTransporter.sendMail(emailConfig);
        console.log('Email sent successfully');
      } catch (err) {
        console.log('Error Occurs', err);
      }
};

module.exports = sendEmail



