const express = require("express");

const router = express.Router();

const { refund, getTotalRefund} = require('../controllers/refund');
const { getUserByID } = require("../controllers/user");
// const {getTripById} = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
// const { isAdmin } = require("../../projfrontend/src/auth/helper");


router.param("userId", getUserByID);
// router.param("tripId", getTripById);

router.post("/refund/:userId", isSignedIn, isAuthenticated, isAdmin, refund);
router.get("/refund/salestotalrefund/:userId", isSignedIn , isAdmin, getTotalRefund)


module.exports = router;