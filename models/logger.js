const mongoose = require('mongoose')

const loggerSchema = new mongoose.Schema({
    message : {
        type: String,
        required : true, 
    }, 
    module : {
        type : String,
        required : true,
    }, 
    functionname : {
        type : String,
        required : true
    }
}, { timestamps: true })

module.exports = mongoose.model('Logger', loggerSchema)
