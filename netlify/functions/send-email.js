require('dotenv').config()
const nodemailer = require('nodemailer');


exports.handler = async function (event, context) {
  // Check for POST request
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  const data = JSON.parse(event.body);

  // Create transporter object using SMTP transport service
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL, // Your email address
      pass: process.env.SMTP_PASSWORD, // Your email password or App password
    },
  });

  // Setup email data
  let mailOptions = {
    from: data.email, // Sender email
    to: process.env.SMTP_EMAIL, // Your receiving email
    subject: `New Contact Form Submission from ${data.name}`,
    text: data.message,
    html: `<p>You have a new contact form submission</p><p><strong>Name: </strong> ${data.name}</p><p><strong>Email: </strong> ${data.email}</p><p><strong>Message: </strong> ${data.message}</p>`,
  };

  // Send mail with defined transport object
  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully!' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error sending email', error: error.toString() }),
    };
  }
};
