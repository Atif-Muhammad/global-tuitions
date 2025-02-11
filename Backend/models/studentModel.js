const mongoose = require('mongoose');
const courseModel = require('./coursesModel')
const enrollment = require('./enrollmentModel')
const inquiry = require("./inquiryModel")
const feedBack = require('./feedBackModel')

const student_schema = mongoose.Schema({
    student_name: String,
    role: String,
    email: String,
    password: String,
    courses_availed: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'enrollment'   
        }
    ], 
    inquiries: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'inquiry'
    }],
    feedBacks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'feedBack'
    }]
})

module.exports = mongoose.model('student', student_schema);