const mongoose = require("mongoose")

const subs_schema = mongoose.Schema({
    subscriber: String,
    email: String,
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

module.exports = mongoose.model('subscription', subs_schema);