const { Booking } = require("../models/booking");
const { handleError } = require("../utils/handleResponse");

exports.getOrderById = (req, res, next, id) => {
  Booking.findById(id)
    .populate("trips.trip", "name ")
    .exec((err, booking) => {
      if (err) return handleError(res, "Could not get booking!", 400);
      req.booking = booking;
      next();
    });
};

exports.createOrder = (req, res) => {
  req.body.booking.user = req.profile;
  const booking = new Booking(req.body.booking);
  booking.save((err, booking) => {
    if (err) return handleError(res, "Failed to save booking in DB!", 400);
    res.json(booking);
  });
};

exports.getAllOrders = (req, res) => {
  Booking.find()
    .populate("user", "_id name")
    .exec((err, booking) => {
      if (err) return handleError(res, "Failed to fetch any booking!", 400);
      res.json(booking);
    });
};

// exports.getOrderStatus = (req, res) => {
//   res.json(Booking.schema.path("status").enumValues);
// };

// exports.updateStatus = (req, res) => {
//   Order.updateOne(
//     { _id: req.body.orderId },
//     { $set: { status: req.body.status } },
//     (err, order) => {
//       if (err) return handleError(res, "Failed to update order status!", 400);
//       res.json(order);
//     }
//   );
// };
