const mongoose = require('mongoose')

const tripConfig = new mongoose.Schema({
    tripConfig : {
    Flight: {
        TravelClass:  ["Economy", "FirstClass", "BusinessClass"],
        SeatType: ["WindowSeat", "MiddleSeat", "AileSeat"],
        PaymentType: ["CreditCard", "DebitCard", "NetBanking"],
        Currency: ["Dollars", "Rupees", "Dhirams", "Pounds"]
    },
    Bus: {
        TravelClass: ["FrontRow", "MiddleRow", "LastRow"],
        SeatType: ["WindowSeat", "AileSeat", "LegSpaceSeat"],
        PaymentType: ["CreditCard", "DebitCard", "NetBanking"],
        Currency: ["Dollars", "Rupees", "Dhirams", "Pounds"]
    },
    Train: {
        TravelClass: ["FirstTier", "SecondTier", "ThirdTier"],
        SeatType: ["WindowSeat", "Sleeping"],
        PaymentType: ["CreditCard", "DebitCard", "NetBanking"],
        Currency: ["Dollars", "Rupees", "Dhirams", "Pounds"]
    },
    Tram: {
        TravelClass: ["AC", "Non-AC"],
        SeatType: ["WindowSeat", "CornerSeat"],
        PaymentType: ["CreditCard", "DebitCard", "NetBanking"],
        Currency: ["Dollars", "Rupees", "Dhirams", "Pounds"]
    },
    Cab: {
        TravelClass: ["Cidan", "Waganor", "XUV"],
        SeatType: ["4Seater", "6Seater"],
        PaymentType: ["CreditCard", "DebitCard", "NetBanking"],
        Currency: ["Dollars", "Rupees", "Dhirams", "Pounds"]
    }
}

}, { timestamps: true })

module.exports = mongoose.model('tripConfiguration', tripConfig)
