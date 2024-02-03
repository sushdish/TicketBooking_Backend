const express = require("express");

const router = express.Router();

const { bookTrip , getUserBookings, getPigination, getUserRewards, getTotalBookings } = require('../controllers/booking');
const { getUserByID } = require("../controllers/user");
// const {getTripById} = require("../controllers/product");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");


router.param("userId", getUserByID);
// router.param("tripId", getTripById);

router.post("/booking/:userId", isSignedIn, isAuthenticated, bookTrip);
router.get("bookingpigination", getPigination )
router.get("/booking/:userId", isSignedIn, isAuthenticated, getUserBookings);
router.get("/booking/rewards/:userId", isSignedIn, isAuthenticated, getUserRewards)
router.get("/booking/totalrevenue/:userId", isSignedIn, isAuthenticated, getTotalBookings)

module.exports = router;
