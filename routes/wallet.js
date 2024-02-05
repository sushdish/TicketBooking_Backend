const express = require("express");

const router = express.Router();

const {wallet, getTotalWallet} = require('../controllers/wallet');
const { getUserByID } = require("../controllers/user");

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

router.param("userId", getUserByID);

router.post("/wallet/:userId", isSignedIn, isAuthenticated,  wallet);
router.get("/wallet/totalwallet/:userId", isSignedIn, isAuthenticated, getTotalWallet)


module.exports = router;