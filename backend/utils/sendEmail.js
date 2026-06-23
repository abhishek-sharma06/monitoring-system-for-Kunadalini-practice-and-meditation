const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  return transporter;
};

const extractUrl = (html) => {
  const match = html.match(/href="([^"]+)"/);
  return match ? match[1] : null;
};

const sendEmail = async ({ to, subject, html }) => {
  const url = extractUrl(html);

  // If no credentials are configured, log to console and return the link.
  const noCredentials =
    !process.env.EMAIL_USER ||
    process.env.EMAIL_USER.includes('your_gmail') ||
    !process.env.EMAIL_PASS ||
    process.env.EMAIL_PASS.includes('your_gmail');

  if (noCredentials) {
    console.log('\n' + '='.repeat(60));
    console.log('  MOCK EMAIL (no Gmail credentials set)');
    console.log('='.repeat(60));
    console.log(`To      : ${to}`);
    console.log(`Subject : ${subject}`);
    if (url) console.log(`Link    : ${url}`);
    console.log('='.repeat(60) + '\n');
    return { success: true, delivered: false, link: url, message: 'Email credentials not configured. Link printed to console.' };
  }

  const mailOptions = {
    from: `"Kundalini Tracker" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  };

  try {
    const transport = getTransporter();
    await transport.verify();
    await transport.sendMail(mailOptions);
    console.log(`✓ Email sent to ${to}`);
    return { success: true, delivered: true, link: url };
  } catch (error) {
    // Email failed — log the error and return the link so frontend can show it.
    console.error(`✗ Email send failed: ${error.message}`);
    console.log('\n' + '='.repeat(60));
    console.log('  EMAIL FALLBACK — verification link:');
    console.log('='.repeat(60));
    console.log(`To      : ${to}`);
    console.log(`Subject : ${subject}`);
    if (url) console.log(`Link    : ${url}`);
    console.log('='.repeat(60) + '\n');
    return { success: true, delivered: false, link: url, message: `Email delivery failed: ${error.message}` };
  }
};

module.exports = sendEmail;
