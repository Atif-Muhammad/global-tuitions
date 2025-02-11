require("dotenv").config();
const express = require("express");
const router = express.Router();
const inquiryModel = require("../../models/inquiryModel");
const coursesModel = require("../../models/coursesModel");
const nodemailer = require("nodemailer");


// get all courses inquiries
router.get("/course", async (req, res) => {
    try {
        const inquiries = await inquiryModel
            .find({ for_course: { $exists: true } })
            .populate("for_course", "course_name");
        res.status(200).send(inquiries);
    } catch (error) {
        res.send(error);
    }
});

// get specific course inquiries
router.get("/course/specific", async (req, res) => {
    const course_id = req.query.id;
    try {
        const inquiries = await inquiryModel
            .find({ for_course: course_id })
            .populate("for_course", "course_name");
        res.status(200).send(inquiries);
    } catch (error) {
        res.send(error);
    }
});

router.get("/general", async (req, res) => {
    try {
        const inquiries = await inquiryModel.find({
            for_course: { $exists: false },
        });
        res.status(200).send(inquiries);
    } catch (error) {
        res.send(error);
    }
});

router.post("/inquiry/reply", async (req, res) => {

    const inquiry_id = req.body.data.inq._id;
    const message = req.body.data.msg;
    try {
        const response = await inquiryModel.findOne(
            { _id: inquiry_id },
            { email: 1 }
        );

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
            to: response.email,
            subject: "Thank you!",
            text: message,
        };

        const sentMail = await transporter.sendMail(mailOptions);
        // console.log(sentMail)
        if (sentMail.accepted != null) {
          // update inquiry collection for reply
          await inquiryModel.updateOne({ _id: inquiry_id }, { reply: message });
          res.sendStatus(200);
        }
    } catch (error) {
        res.send(error);
    }
});

// update the replied flag
router.put("/inquiry/updateReplied", async (req, res) => {
    const inq_id = req.body.id;
    try {
        const updated = await inquiryModel.updateOne(
            { _id: inq_id },
            { $set: { replied_flag: true } }
        );
        res.status(200).send(updated);
    } catch (error) {
        res.send(error);
    }
});

// update the replied flag
router.put("/inquiry/updateViewed", async (req, res) => {
    const inq_id = req.body.id;
    // console.log(inq_id)
    try {
        await inquiryModel.updateOne(
            { _id: inq_id },
            { $set: { viewed_flag: true } }
        );
        res.sendStatus(200);
    } catch (error) {
        res.send(error);
    }
});

router.get('/FreeCourse/specific', async (req, res)=>{
    const course_id = req.query.id;
    try {
        const inquiries = await inquiryModel
            .find({ for_course: course_id })
            .populate("for_course", "course_name");
        res.status(200).send(inquiries);
    } catch (error) {
        res.send(error);
    }
})


module.exports = router;