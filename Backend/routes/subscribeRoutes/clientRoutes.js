const express = require("express")
const router = express.Router();
const subscription = require('../../models/subscribeModel')
const nodemailer = require("nodemailer");

router.post("/subscribe", async (req, res) => {

    try {
        // find if an email has already subscribed
        const found = await subscription.find({ email: req.body.data.email });
        if (found.length > 0) {
            return res.status(409).send("already subscribed")
        }
        await subscription.create(req.body.data);
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
            to: req.body.data.email,
            subject: "Thank you!",
            text: "Thank you for you query, we will get back to you soon. regards imperial tuitions",
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
