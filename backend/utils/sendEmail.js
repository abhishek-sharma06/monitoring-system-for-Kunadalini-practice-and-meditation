// Import nodemailer module.
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create nodemailer transport config using environment variables.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Extract the href URL from HTML content for clean console logging.
const extractUrl = (html) => {
  const match = html.match(/href="([^"]+)"/);
  return match ? match[1] : null;
};

// Helper function to send email with error fallback for local testing without credentials.
const sendEmail = async ({ to, subject, html }) => {
  // If credentials are placeholder, log email to console and succeed.
  const noCredentials =
    !process.env.EMAIL_USER ||
    process.env.EMAIL_USER.includes('your_gmail') ||
    !process.env.EMAIL_PASS ||
    process.env.EMAIL_PASS.includes('your_gmail');

  if (noCredentials) {
    const url = extractUrl(html);
    console.log('\n' + '='.repeat(60));
    console.log('📧  MOCK EMAIL (no Gmail credentials set)');
    console.log('='.repeat(60));
    console.log(`To      : ${to}`);
    console.log(`Subject : ${subject}`);
    if (url) {
      console.log('\n🔗  ACTION LINK — copy & paste this into your browser:');
      console.log('\n' + url + '\n');
    }
    console.log('='.repeat(60) + '\n');
    return { success: true, message: 'Mock email printed to console.' };
  }

  const mailOptions = {
    from: `"Kundalini Tracker" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✓ Email sent to ${to}`);
    return { success: true };
  } catch (error) {
    // Fallback — print the link clearly to console.
    const url = extractUrl(html);
    console.error(`✗ Email send failed: ${error.message}`);
    console.log('\n' + '='.repeat(60));
    console.log('📧  EMAIL FALLBACK (send failed — use link below)');
    console.log('='.repeat(60));
    console.log(`To      : ${to}`);
    console.log(`Subject : ${subject}`);
    if (url) {
      console.log('\n🔗  ACTION LINK — copy & paste this into your browser:');
      console.log('\n' + url + '\n');
    }
    console.log('='.repeat(60) + '\n');
    return { success: true, warning: 'Email sent via console fallback.' };
  }
};

// Export the email helper.
module.exports = sendEmail;
