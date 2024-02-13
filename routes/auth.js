const express = require("express");
const { check, validationResult } = require("express-validator");

const router = express.Router();
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { signup, signin, signout,  adminSignup , getAllAdmin, statusChange, search} = require("../controllers/auth");
const { getUserByID } = require("../controllers/user");

router.param("userId", getUserByID);

router.post(
  "/signup",
  [
    check("email").isEmail().withMessage("Enter a valid email!"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password should be atleast 8 character long!"),
  ],
  signup
);


router.post(
  "/adminsignup",
  [
    check("email").isEmail().withMessage("Enter a valid email!"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password should be atleast 8 character long!"),
  ],
  adminSignup
);

router.get(
  "/getAllAdmin/:userId",  isSignedIn, isAuthenticated, isAdmin,
  
  getAllAdmin
);

router.get(
  "/getUser/:userId",  isSignedIn, isAuthenticated, isAdmin,
  
  search
);

router.put(
  "/status/update/:userId/:status",  isSignedIn, isAuthenticated, isAdmin,
  
  statusChange
);


router.post(
  "/signin",
  [
    check("email").isEmail().withMessage("Enter a valid email!"),
    check("password").isLength({ min: 1 }).withMessage("Password is requires!"),
  ],
  signin
);

router.get("/signout", signout);

router.get("/protected", isSignedIn, (req, res) => {
  res.send(req.auth);
});

module.exports = router;
