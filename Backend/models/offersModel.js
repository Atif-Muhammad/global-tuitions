const mongoose = require("mongoose")

const offersSchema = mongoose.Schema({
    title: String,
    description: String,
    theme: String,
    enabled_flag: Boolean,
    sortValue: Number,
    code: String,
    validTill: String
}, {timestamps: true})


module.exports = mongoose.model('offers', offersSchema);