const nodemailer = require('nodemailer');
async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use false for TLS
    auth: {
      user: '191260107039setice@gmail.com', // Your Gmail email address
      pass: 'yuts qvzx fuqs gbtz' // Your app password
    }
  });

  const mailOptions = {
    from: '191260107039setice@gmail.com',
    to: '191260107039setice@gmail.com', // Change this to a valid recipient email
    subject: 'Test Email',
    text: 'This is a test email sent using Nodemailer!'
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Test email sent successfully!');
  } catch (error) {
    console.error('Error sending test email:', error);
  }
}

// Call the test function
testEmail();