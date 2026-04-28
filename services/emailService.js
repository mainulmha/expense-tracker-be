require("dotenv").config();
const nodemailer = require("nodemailer");

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const FRONTEND_URL = process.env.FRONTEND_URL;

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Test connection
const testConnection = async () => {
  try {
    await transporter.verify();
    console.log("✅ Email service is ready");
    return true;
  } catch (error) {
    console.error("❌ Email service error:", error.message);
    return false;
  }
};

// Send Verification Email
const sendVerificationEmail = async (email, name, verificationToken) => {
  const verificationUrl = `${FRONTEND_URL}/verify-email?token=${verificationToken}`;
  const mailOptions = {
    from: `"Expense Tracker" <${EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email Address - My Expense",
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 20px; text-align: center;">
                    <h1 style="color: white;">💰 My Expense</h1>
                </div>
                <div style="padding: 20px; border: 1px solid #ddd;">
                    <h2>Hello ${name}!</h2>
                    <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationUrl}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Verify Email</a>
                    </div>
                    <p>Or copy this link: <a href="${verificationUrl}">${verificationUrl}</a></p>
                    <p>This link will expire in 24 hours.</p>
                    <hr />
                    <p style="font-size: 12px; color: #666;">If you didn't create an account, please ignore this email.</p>
                </div>
            </div>
        `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    console.log("   Message ID:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Email error:", error.message);
    console.error("   Full error:", error);
    return false;
  }
};

const sendOTPEmail = async (email, name, otp) => {
  const mailOptions = {
    from: `"My Expense" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset OTP - My Expense",
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 20px; text-align: center;">
                    <h1 style="color: white;">💰 Expense Tracker</h1>
                </div>
                <div style="padding: 20px; border: 1px solid #ddd;">
                    <h2>Hello ${name}!</h2>
                    <p>We received a request to reset your password. Use the following OTP to reset your password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; background: #f0f0f0; padding: 15px; border-radius: 10px;">
                            ${otp}
                        </div>
                    </div>
                    <p>This OTP is valid for <strong>10 minutes</strong>.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <hr />
                    <p style="font-size: 12px; color: #666;">Expense Tracker - Manage Your Finances</p>
                </div>
            </div>
        `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ OTP email error:", error.message);
    return false;
  }
};

module.exports = { sendVerificationEmail, testConnection, sendOTPEmail };
