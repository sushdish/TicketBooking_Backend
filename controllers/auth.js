const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
var cookieParser = require("cookie-parser");

const User = require("../models/user");
const { handleError, handleSuccess } = require("../utils/handleResponse");

exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      err: errors.errors[0].msg,
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) return handleError(res, "Could not save user to DB", 400);
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
      message: "Successfully Signed Up"
    });
  });
};

exports.adminSignup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      err: errors.errors[0].msg,
    });
  }

  req.body.role = "1"

  const user = new User(req.body);
  console.log(user, "42")
  console.log(req.body, "43")
  user.save((err, user) => {
    if (err) return handleError(res, "Could not save user to DB", 400);
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
      role: user.role,
      message: "Successfully Signed Up"
    });
  });
};

exports.statusChange = (req, res) => {
  const {userId} = req.body
  console.log(userId, "58")
  const status = req.params.status
  console.log(status, "60")
  if (status == "Active") {
    User.findByIdAndUpdate(
      {_id: userId},
      {$set : { "status": "Inactive"}},
      {new: true, useFindAndModify: false },
      (err, update) => {
          if(err) {
              return res.status(400).json({
                  error: "Not authorized to edit"
              })
          }
          res.send(update)
      }
  )
  } else if (status == "Inactive"){
    User.findByIdAndUpdate(
      {_id: userId},
      {$set : { "status": "Active"}},
      {new: true, useFindAndModify: false },
      (err, updatee) => {
          if(err) {
              return res.status(400).json({
                  error: "Not authorized to edit"
              })
          }
          res.send(updatee)
      }
  )
  }
 
}

exports.getAllAdmin = async(req, res) => {

  const { userId } = req.params;

  const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

  try {
    const pipeline = [
      {
        $match: {
          'role': 1
        } 
      }
      
    ]

    const TotalUser = await User.aggregate(pipeline)
    console.log(TotalUser , "TotalUser") //all 12 trips in this
    console.log(pipeline, "144") // $match in this pipeline

     pipeline.push(
      { $skip: JSON.parse(req.query.page) > 0 ? ((JSON.parse(req.query.page) - 1) * 5) : 0 },
      { $limit: 5 },
     )

    const result = await User.aggregate(pipeline)
    console.log(result, "149") 
    
    console.log(pipeline, "158") 

    res.json({
      users: result,
      totalUsers: TotalUser.length,

    })
}catch (error) {
  res.status(500).json({ error: 'Internal Server Error' });
}



};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.json({
      err: errors.errors[0].msg,
    });
  }

  User.findOne({ email: email }, (err, user) => {
    if (err) return handleError(res, "Database error, please try again!", 400);

    if (!user) return handleError(res, "User does not exist!", 400);

    if (!user.authenticate(password))
      return handleError(res, "Incorrect username or password!", 401);

    const { _id, name, email, role } = user;

    // Create a token
    const token = jwt.sign({ _id: _id }, process.env.SECRET);
    // Store the token in a cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  
  return handleSuccess(res, "user signed out!!");
};

// Protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

// Custom middleware
exports.isAuthenticated = (req, res, next) => {
  const check = req.profile && req.auth && req.profile._id == req.auth._id;

  if (!check) return handleError(res, "Access Denied!", 403);
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) return handleError(res, "Access Denied!", 403);
  next();
};
