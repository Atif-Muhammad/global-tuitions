const express = require("express");
const router = express.Router();
const subscription = require("../../models/subscribeModel");
const nodemailer = require("nodemailer");

router.post("/reply", async (req, res) => {
  const emails = req.body.payload.emails;
  const message = req.body.payload.msg;
  // console.log(emails)
  // console.log(message)
  // send an instant email to user
  // create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_PASS,
    },
  });

  emails.forEach(async (email) => {
    // create email message
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: "Thank you!",
      text: message,
    };

    try {
      const sentMail = await transporter.sendMail(mailOptions);
      //  console.log(sentMail)
      if (sentMail.accepted != null) {
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.log(error);
    }
  });
});

router.get("/subscribers", async (req, res) => {
  try {
    const subs = await subscription.find();
    res.send(subs);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
