const mongoose = require('mongoose');
const course = require('./coursesModel')
const student = require('./studentModel')

const enrollSchema = mongoose.Schema({
    applier: String,
    applier_email: String,
    applier_phone: Number,
    applier_Address: String,
    message: String,
    preferred_date: String,
    preferred_time: String,
    Approved: {
        type: Boolean,
        default: false
    },
    Rejected: {
        type: Boolean,
        default: false
    },
    Reply: {
        type: String,
        default: ""
    },
    replied_flag: {
        type: Boolean,
        default: false
    },
    viewed_flag: {
        type: Boolean,
        default: false
   },
    for_course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course'
    }
}, { timestamps: true })

module.exports = mongoose.model('enrollment', enrollSchema);