import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST, // Your email provider
  port: 587, // Your email provider SMTP port
  secure: false, // Use false for TLS, true for SSL (port 465)
  auth: {
    user: process.env.EMAIL_SERVER_USER, // Your SMTP email address
    pass: process.env.EMAIL_SERVER_PASSWORD, // Your SMTP email password
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const mailOptions = {
      from: `"RDP Datacenter" <${process.env.EMAIL_FROM}>`, // Display name and sender email
      to, // Recipient email
      subject, // Email subject
      html, // Email content in HTML format
      replyTo: process.env.REPLY_TO, // Reply to email
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error sending email to ${to}:`, error.message);
    } else {
      console.error(`Unknown error occurred while sending email to ${to}`);
    }
    throw new Error('Failed to send email. Please check your configuration.');
  }
};
