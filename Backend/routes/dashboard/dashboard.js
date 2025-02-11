require("dotenv").config();
const express = require("express");
const enrollmentModel = require("../../models/enrollmentModel");
const coursesModel = require("../../models/coursesModel");
const categoriesModel = require("../../models/categoriesModel");
const inquiryModel = require("../../models/inquiryModel");
const router = express.Router();


router.get('/', async (req, res)=>{
    try {
        const course_count = await coursesModel.find({$and: [{enabled_flag: true}, {deleted: false}]}).countDocuments()
        const category_count = await categoriesModel.find({$and: [{enabled_flag: true}, {deleted: false}]}).countDocuments()
        const enroll_count = await enrollmentModel.countDocuments()
        const course_inquiries = await inquiryModel.find({for_course: {$exists: true}}).countDocuments()
        const general_inquiries = await inquiryModel.find({for_course: {$exists: false}}).countDocuments()


        const data = {
            enroll_count,
            course_count,
            category_count,
            course_inquiries,
            general_inquiries
        }
        res.send(data)
    } catch (error) {
        res.send(error)
    }
})



module.exports = router;