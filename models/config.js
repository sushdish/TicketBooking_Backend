const mongoose = require('mongoose')

const configSchema = new mongoose.Schema({
    tripConfig : {
        type: Array,
    }

}, { timestamps: true })

module.exports = mongoose.model('Configuration', configSchema)
