const mongoose = require('mongoose');
const studentModel = require('./studentModel')


const codeSchema = mongoose.Schema({
    for_student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "student"
    },
    code: String
})

module.exports = mongoose.model('codes', codeSchema)