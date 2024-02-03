const Refund = require('../models/refund');
const Trip = require("../models/trips");
const { validationResult } = require('express-validator');
const User = require("../models/user")
const mongoose = require('mongoose');

exports.refund = async (req, res) => {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    console.log(user, "YY")
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const {tripId, amount} = req.body

    const refund = new Refund({
        userId: userId,
        tripId,
        amount,
    })


    const savedRefund = await refund.save()


      res.json(savedRefund);
      console.log(savedRefund, "ZZ")
  }catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.getTotalRefund = async(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {

    // const { userId } = req.params;

    // // Check if the user exists
    // const user = await User.findById(userId);
    // if (!user) {
    //   return res.status(404).json({ error: 'User not found' });
    // }

    const pipeline = await Refund.aggregate([
      {
        $group: {
          _id: null,
          totalRefund: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id:0,                 //0 = excluded the field
          totalRefund: 1         // 1 = include the field
        }
      },
    ])

    // res.json({totalRefund:pipeline[0].totalRefund})
    res.json(pipeline[0])
    console.log(pipeline, "67")
    // console.log(res, "68")

  }catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}