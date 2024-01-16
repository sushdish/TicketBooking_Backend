const mongoose = require('mongoose')

const configSchema = new mongoose.Schema({
    flights: {
        type: Object,
    },
    Buses: {
        type: Object,
    },
    Railways: {
        type: Object,
    },

}, { timestamps: true })

module.exports = mongoose.model('Confi', configSchema)
