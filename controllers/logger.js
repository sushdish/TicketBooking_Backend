const Logger = require("../models/logger");

module.exports = {
    async createLogger(message , collectionName , functionName) {
        const body = {
            message : message, 
            module : collectionName, 
            functionname : functionName
        }

        const result = new Logger(body) 
        await result.save()
    }
}