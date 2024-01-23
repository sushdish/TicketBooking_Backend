const express = require("express");

const router = express.Router();

const {createConfig, getAllConfig, tripConfig} = require("../controllers/config")

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserByID } = require("../controllers/user");

router.param("userId", getUserByID);

router.post(
    "/config/create/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    createConfig
  );

  router.post(
    "/config/tripconfig/:categoryId",
    // isSignedIn,
    // isAuthenticated,
    tripConfig
  );

  

  router.get("/config", getAllConfig);

  module.exports = router;