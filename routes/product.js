const express = require("express");

const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserByID } = require("../controllers/user");
const {
  getTripById,
  createTrip,
  getTrip,
  updateTrip,
  deleteTrip,
  getAllTrip,
} = require("../controllers/product");

router.param("userId", getUserByID);
router.param("tripId", getTripById);

router.post(
  "/trip/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createTrip
);

router.get("/trip/:tripId", getTrip);
// router.get("/product/photo/:productId", getPhoto);

router.get("/trips", getAllTrip);
// router.get("/products/categories", getAllUniqueCategories);

router.put(
  "/trip/:tripId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateTrip
);

router.delete(
  "/trip/:tripId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteTrip
);

module.exports = router;
