const User = require("../models/user");
const Booking = require("../models/booking");

const { handleError } = require("../utils/handleResponse");

exports.getUserByID = (req, res, next, id) => {
  User.findById(id, (err, user) => {
    if (err || !user) handleError(res, "User not found!", 400);
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  // TODO: get back here for password
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  req.profile.__v = undefined;
  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.profile._id,
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) handleError(res, "Could not update user!", 400);
      user.salt = undefined;
      user.encry_password = undefined;
      user.createdAt = undefined;
      user.updatedAt = undefined;
      user.__v = undefined;
      res.json(user);
    }
  );
};

exports.userPurchaseList = (req, res) => {
  Booking.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, bookings) => {
      if (err) return handleError(res, "Booking not found!", 400);
      return res.json(bookings);
    });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];
  req.body.booking.trips.forEach((trip) => {
    const { _id, name, tripNumber, category, trip_details } = trip;
    purchases.push({
      _id,
      name,
      tripNumber,
      category,
      trip_details,
      // amount: req.body.order.amount,
      paymentReferenceNumber: req.body.booking.paymentReferenceNumber,
    });
  });

  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true },
    (err) => {
      if (err) handleError(res, "Unable to save purchase list!", 400);
      next();
    }
  );
};
