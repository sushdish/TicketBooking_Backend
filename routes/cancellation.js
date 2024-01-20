const express = require("express");

const router = express.Router();

const { cancellation} = require('../controllers/cancellation');
const { getUserByID } = require("../controllers/user");
const {getTripById} = require("../controllers/trips");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const {getUserCancellations, getPendingCancellations, adminReason, getSolvedRequest, getAdminResolvedReq, pigination} = require("../controllers/cancellation")

router.param("userId", getUserByID);
// router.param("tripId", getTripById);
router.get("/pigination", pigination)
router.post("/cancellation/:userId", isSignedIn, isAuthenticated, cancellation);
router.get("/cancellation/:userId", isSignedIn, isAuthenticated, getUserCancellations)
router.get("/cancellation/pending/:userId", isSignedIn, isAuthenticated, isAdmin, getPendingCancellations )
router.put("/cancellation/update/:userId", isSignedIn, isAuthenticated, isAdmin, adminReason )
router.get("/cancellation/solved/:userId", isSignedIn, isAuthenticated,  getSolvedRequest )
router.get("/cancellation/adminsolved/:userId", isSignedIn, isAuthenticated, isAdmin, getAdminResolvedReq )
// router.get("/booking/:userId", isSignedIn, isAuthenticated, getUserBookings);

module.exports = router;
