
require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" })); // Allow all origins
app.use(express.json()); // Use express built-in JSON parser

const EMAIL_USER = process.env.EMAIL_USER || "your-email@gmail.com";
const EMAIL_PASS = process.env.EMAIL_PASS || "your-password";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";

// Log environment variables for debugging
console.log("Email User:", EMAIL_USER);
console.log("Admin Email:", ADMIN_EMAIL);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

app.post("/send-mail", async (req, res) => {
  console.log("Received request:", req.body); // Debugging log

  const { Name, Email, Mobile, Date, Time, Service } = req.body;

  if (!Name || !Email || !Mobile || !Date || !Time || !Service) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const userMailOptions = {
    from: EMAIL_USER,
    to: Email,
    subject: "Appointment Confirmation Shashank Bhargawa Clinic",
    html: `<p>Dear ${Name},</p>\n
           <p>Thank you for scheduling your appointment with Shashank Bhargawa Clinic. We are pleased to confirm your appointment details:</p>
           <p>Your appointment for <strong>${Service}</strong> has been confirmed.</p>
           <p><strong>Date:</strong> ${Date}</p>
           <p><strong>Time:</strong> ${Time}</p>
           <p><strong>Location:</strong> MPEB office, opposite, gate no 4, Madhav Nagar, Ujjain, Madhya Pradesh 456010</p>
            <p><strong>Doctor:</strong> Shashank Bhargawa</p>\n
            <p>Please arrive 10 minutes before your scheduled time. If you need to reschedule or cancel, kindly contact us at 9685533878 or reply to this email at akashraikwar763@gmail.com.</p>\n
           <p>We look forward to seeing you!</p>\n 
           <p><strong>Best Regards,</strong></p>
           <p>Shashank Bhargawa Clinic</p>
           <p>9685533878 | akashraikwar763@gmail.com | www.sosapient.in</p>`,
  };

  const adminMailOptions = {
    from: EMAIL_USER,
    to: ADMIN_EMAIL,
    subject: "New Appointment Booking",
    html: `<p>A new appointment has been booked:</p>
           <p><strong>Name:</strong> ${Name}</p>
           <p><strong>Email:</strong> ${Email}</p>
           <p><strong>Phone:</strong> ${Mobile}</p>
           <p><strong>Date:</strong> ${Date}</p>
           <p><strong>Time:</strong> ${Time}</p>
           <p><strong>Service:</strong> ${Service}</p>`,
  };

  try {
    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(adminMailOptions);
    console.log("Emails sent successfully.");
    res.status(200).json({ message: "Emails sent successfully!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
