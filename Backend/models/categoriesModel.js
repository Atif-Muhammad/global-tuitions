const mongoose = require('mongoose')
const course = require('./coursesModel')
// create category schema
const category_schema = mongoose.Schema({
    category_name: String,
    enabled_flag: Boolean,
    sort_value: Number,
    deleted: {
        type: Boolean,
        default: false
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'course'
        }
    ]
})

module.exports = mongoose.model('category', category_schema);