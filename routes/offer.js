const express = require("express");

const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserByID } = require("../controllers/user");




const {bookOffer, getAllOffer, updateOffer, getOfferById, getOffer, deleteOffer} = require("../controllers/offer")

router.param("userId", getUserByID);
router.param("offerId", getOfferById);

router.post("/bookoffer/create/:userId", isSignedIn, isAuthenticated, isAdmin, bookOffer )
router.get("/bookoffer/alloffer/:userId",  isSignedIn, isAuthenticated, isAdmin, getAllOffer )
router.put("/bookoffer/update/:userId/:offerId", isSignedIn, isAuthenticated, isAdmin, updateOffer )
router.get("/bookoffer/offer/:offerId", getOffer )
router.delete(
    "/deleteoffer/:offerId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    deleteOffer
  );

module.exports = router;
