const express = require('express');
const enrollmentModel = require('../../models/enrollmentModel');
const coursesModel = require('../../models/coursesModel');
const router = express.Router();
const nodemailer = require("nodemailer");

router.get('/', async (req, res) => {
    try {
        const data = await enrollmentModel.find({}).populate("for_course", "course_name");
        res.status(200).send(data)
    } catch (error) {
        res.send(error);
    }
})
router.get('/course/enrollments', async (req, res) => {

    try {
        const data = await enrollmentModel.find({for_course: req.query.id}).populate("for_course", "course_name");
        res.status(200).send(data)
    } catch (error) {
        res.send(error);
    }
})


router.post('/enrollmentReply', async (req, res) => {
    // console.log(req.body.data)
    try {
        const enrollment = await enrollmentModel.find({ _id: req.body.data.id });

        if (enrollment) {
            await enrollmentModel.updateOne({_id: req.body.data.id}, {viewed_flag: true})
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
                text: req.body.data.msg,
            };

            const sentMail = await transporter.sendMail(mailOptions);
            // console.log(sentMail)
            if (sentMail.accepted != null) {
                // update inquiry collection for reply
                enrollment[0].Reply = req.body.data.msg;
                enrollment[0].replied_flag = !enrollment[0].replied_flag; // Toggle the value
                await enrollment[0].save();
                res.sendStatus(200);
            }
            
            
        }
    } catch (error) {
        res.send(error)
    }
})

router.put('/approval', async (req, res) => {
    // console.log(req.body)
    try {
        const enrollment = await enrollmentModel.find({ _id: req.body.id });
        if (enrollment) {
            await enrollmentModel.updateOne({_id: req.body.id}, {viewed_flag: true})
            // console.log(enrollment)
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
                to: enrollment[0].applier_email,
                subject: "Thank you!",
                text: "req.body.msg",
            };

            const sentMail = await transporter.sendMail(mailOptions);
            // console.log(sentMail)
            if (sentMail.accepted != null) {
                // update inquiry collection for reply
                enrollment[0].Approved = true; // Toggle the value
                enrollment[0].Rejected = false
                await enrollment[0].save();
                res.sendStatus(200);
            }
            
            
        }
    } catch (error) {
        res.send(error)
    }
})

router.put('/rejection', async(req, res)=>{
    try {
        const enrollment = await enrollmentModel.find({ _id: req.body.id });
        if (enrollment) {
            await enrollmentModel.updateOne({_id: req.body.id}, {viewed_flag: true})
            // console.log(enrollment)
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
                to: enrollment[0].applier_email,
                subject: "Thank you!",
                text: "req.body.msg",
            };

            const sentMail = await transporter.sendMail(mailOptions);
            // console.log(sentMail)
            if (sentMail.accepted != null) {
                // update inquiry collection for reply
                enrollment[0].Rejected = true; // Toggle the value
                enrollment[0].Approved = false
                await enrollment[0].save();
                res.sendStatus(200);
            }
            
            
        }
    } catch (error) {
        res.send(error)
    }
})



module.exports = router;