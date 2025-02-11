
const mongoose = require('mongoose');
const course = require('./coursesModel')

const course_contents_schema = mongoose.Schema({
    topic: String,
    enabled_flag: Boolean,
    sort_value: Number,
    content_description: String,
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course'
    }
   
});

module.exports = mongoose.model('course_content', course_contents_schema);