const mongoose = require('mongoose');
const category = require('./categoriesModel');
const inquiry = require('./inquiryModel');
const enrollment = require('./enrollmentModel')
const student = require('./studentModel')
const course_content = require('./courseContentsModel')
const feedBack = require('./feedBackModel')

const courses_schema = mongoose.Schema({
    course_name: String,
    enabled_flag: Boolean,
    sort_value: Number,
    date: Date,
    deleted:{
        type: Boolean,
        default: false
    },
    time: {
        type: String, // Field to store time as a string
        validate: {
          validator: function (v) {
            // Basic regex to validate HH:mm time format
            return /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/.test(v);
            },
            message: (props) => `${props.value} is not a valid time format! Use HH:mm.`,
        }
    },
    price: {
        type: Number,
    },
    course_description: String,
    rating: {
        type: Number,
        default: 0.0
    },
    course_level: String,
    course_duration: Number, 
    popular: {
        type: Boolean,
        default: false
    },
    skills: Array,
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    course_contents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'course_content'
        }
    ],
    inquiries: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'inquiry'
        }
    ],
    enrollments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'enrollment'
        }
    ],
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'student'
        }
    ],
    feedBacks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'feedBack'
    }]
})

module.exports = mongoose.model('course', courses_schema);