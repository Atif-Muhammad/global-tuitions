const express = require("express")
const router = express.Router();
const subscription = require('../../models/subscribeModel')
const nodemailer = require("nodemailer");

router.post("/subscribe", async (req, res) => {

    try {
        // find if an email has already subscribed
        const found = await subscription.find({ email: req.body?.data?.email });
        if (found.length > 0) {
            return res.status(409).send("already subscribed")
        }
        await subscription.create(req.body?.data);
        // send an instant email to user
        // create transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_PASS,
            },
        });
        
        // create email message
        const mailOptions = {
          from: process.env.ADMIN_EMAIL,
          to: req.body?.data?.email,
          subject: "You’re Subscribed! Get Ready for Exclusive Updates",
          html: `
            <h2>Dear Student,</h2>
            <p>
            Thank you for subscribing to <strong>Global Tuitions</strong>! 🎉 You’re now part of our learning community, and we’re excited to keep you updated with the latest courses, expert insights, and special offers.
            </p>
            <p>Here’s what you can expect:</p>
            <ul>
            <li>✔️ Regular updates on new courses and subjects 📚</li>
            <li>✔️ Exclusive offers and discounts 💡</li>
            <li>✔️ Important announcements and learning tips 🚀</li>
            </ul>
            <p>
            Stay tuned—your learning journey starts here! If you ever have any questions, feel free to reach out at <a href="mailto:sixpmmediaofficial@gmail.com" style="color: #1e73be; text-decoration: none;">sixpmmediaofficial@gmail.com</a>.
            </p>
            <p>
            <strong>Happy Learning!</strong><br>
            <strong>SIX PM Media</strong><br>
            <a href="http://51.24.30.180/5173">Visit our Website</a>
            </p>
            `,
        };

        
        const sentMail = await transporter.sendMail(mailOptions);
        //  console.log(sentMail)
        if (sentMail.accepted != null) {
            res.sendStatus(200);
        } else {
            res.sendStatus(404)
        }
    
    } catch (error) {
        res.send(error)
    }
})


router.post("/unsubscribe", async (req, res) => {

})




module.exports = router;
