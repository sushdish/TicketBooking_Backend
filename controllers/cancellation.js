const Cancellation = require('../models/cancellation');
const Bookings = require('../models/booking');

const Refund = require('../models/refund')
const Trip = require("../models/trips");
const { validationResult } = require('express-validator');
const User = require("../models/user")
const mongoose = require('mongoose');

exports.cancellation = async (req, res) => {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId } = req.params;
    console.log('Request Params:', req.params);
    console.log('Request Body:', req.body);


    const user = await User.findById(userId);
    console.log(user, "YY")
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    

    const {tripId, bookingId, userReason} = req.body

     // Convert tripId to ObjectID if it's a string
    //  const objectIdTripId = mongoose.Types.ObjectId(tripId);

    const cancellation = new Cancellation({
        userId: userId,
        tripId,
        bookingId,
        userReason,
        requestSolved: false
    })

    cancellation.requestSolved = false;

    const savedCancellation = await cancellation.save()


      res.json(savedCancellation);
      console.log(savedCancellation, "ZZ")
  }catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// exports.cancellation = (req, res) => {
//   const cancel = new Cancellation(req.body);
//   cancel.save((err, cancel) => {
//     if (err) return handleError(res, "Could not cancel booking!", 400);
//     res.json({message: "Successfully cancelled booking", cancel });
//   });
// }







exports.getUserCancellations = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId } = req.params;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // const tripId = mongoose.Types.ObjectId(req.query.tripId);
    // console.log(tripId, "WW");
    // Use $match aggregation stage to filter bookings for the user
    const userBookings = await Cancellation.aggregate([
      {
        $match: {
          'userId':  mongoose.Types.ObjectId(req.params.userId), // Assuming the 'user' field in Booking model references the 'User' model
        }

      },
      {
        $lookup: {
          'from':'bookings',
          'localField': 'bookingId',
          'foreignField': '_id',
          'as': 'result'
        }
        }, 
        {
          $lookup: {
            'from': 'trips',
            'localField': 'tripId',
            'foreignField': '_id',
            'as':'result2'
          }
        },
        {
         '$unwind':{
          'path':'$result'
        } 
      },
      {
        '$unwind': {
          'path': '$result2'
        }
      },
      {
        "$project":{
          "cancellationId":"$_id", 
          "bookingId":"$bookingId",
          "tripId":"$tripId",
          "userReason":"$userReason" ,
          "tripName":"$result2.name",
          "tripDestinationA":"$result2.trips_details.DestinationA",
          "tripDestinationB":"$result2.trips_details.DestinationB" ,
          "StartTime":"$result2.trips_details.StartTime" ,
          "EndTime":"$result2.trips_details.EndTime",
        }
      }
    ]);

    res.json(userBookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Admin Side 
exports.getPendingCancellations = async (req, res) => {    
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId } = req.params;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const pendingCancellations = await Cancellation.aggregate([
      {
        $match: {
          // 'userId':  mongoose.Types.ObjectId(req.params.userId),
          'requestSolved':false, // Assuming the 'user' field in Booking model references the 'User' model
        }

      },
        {
          $lookup: {
            'from': 'trips',
            'localField': 'tripId',
            'foreignField': '_id',
            'as':'result2'
          }
        },
      {
        '$unwind': {
          'path': '$result2'
        }
      },
      {
        "$project":{
          "cancellationId":"$_id", 
          "bookingId":"$bookingId",
          "tripId":"$tripId",
          "userReason":"$userReason" ,
          "tripName":"$result2.name",
          "tripDestinationA":"$result2.trips_details.DestinationA",
          "tripDestinationB":"$result2.trips_details.DestinationB" ,
          "StartTime":"$result2.trips_details.StartTime" ,
          "EndTime":"$result2.trips_details.EndTime",
        }
      }
    ]);

    console.log('Pending Cancellations:', pendingCancellations);

    res.json(pendingCancellations);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.adminReason = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { userId } = req.params;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const {adminReason, cancellationId, bookingId, refundId} = req.body

    const updatedCancellation = await Cancellation.findByIdAndUpdate(
      {_id: cancellationId},
      {$set : {adminReason, requestSolved: true}},
      {new: true}
    )

    if (!updatedCancellation) {
      return res.status(404).json({ error: 'Cancellation not found' });
    }

    const deleteBooking = await Bookings.findByIdAndDelete(
      {_id : bookingId},)

    // const refund = await Refund.findByIdAndUpdate(
    //   {_id: refundId},
    //   {$set: {amount}},
    //   {new: true}
    //   )

    console.log(updatedCancellation);
    res.json(updatedCancellation);
    res.json(deleteBooking);
    // res.json(refund)
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

}

// User Side
exports.getSolvedRequest = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId } = req.params;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const solvedRequest = await Cancellation.aggregate([
      {
        $match: {
          'userId':  mongoose.Types.ObjectId(req.params.userId),
          'requestSolved':true, // Assuming the 'user' field in Booking model references the 'User' model
        }

      },
      {
        $lookup: {
          'from': 'trips',
          'localField': 'tripId',
          'foreignField': '_id',
          'as':'result2'
        }
      },
      {
        '$unwind': {
          'path': '$result2'
        }
      },
      {
        "$project":{
          "cancellationId":"$_id", 
          "bookingId":"$bookingId",
          "tripId":"$tripId",
          "userReason":"$userReason" ,
          "adminReason": "$adminReason",
          "tripName":"$result2.name",
          "tripDestinationA":"$result2.trips_details.DestinationA",
          "tripDestinationB":"$result2.trips_details.DestinationB" ,
          "StartTime":"$result2.trips_details.StartTime" ,
          "EndTime":"$result2.trips_details.EndTime",
        }
      }
    ]);

    console.log('Pending Cancellations:', solvedRequest);

    res.json(solvedRequest);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAdminResolvedReq = async (req, res) => {    
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId } = req.params;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const solvedCancellations = await Cancellation.aggregate([
      {
        $match: {
          // 'userId':  mongoose.Types.ObjectId(req.params.userId),
          'requestSolved':true, // Assuming the 'user' field in Booking model references the 'User' model
        }

      },
        {
          $lookup: {
            'from': 'trips',
            'localField': 'tripId',
            'foreignField': '_id',
            'as':'result2'
          }
        },
      {
        '$unwind': {
          'path': '$result2'
        }
      },
      {
        "$project":{
          "cancellationId":"$_id", 
          "bookingId":"$bookingId",
          "tripId":"$tripId",
          "userReason":"$userReason" ,
          "adminReason": "$adminReason",
          "tripName":"$result2.name",
          "tripDestinationA":"$result2.trips_details.DestinationA",
          "tripDestinationB":"$result2.trips_details.DestinationB" ,
          "StartTime":"$result2.trips_details.StartTime" ,
          "EndTime":"$result2.trips_details.EndTime",
        }
      }
    ]);

    // console.log('Pending Cancellations:', pendingCancellations);

    res.json(solvedCancellations);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



// await new EmailLog({
//   from: "donotreply@nathanhr.ae",
//   to: toEmail,
//   cc: cc_emails,
//   subject: subject,
//   body: body, 
//   attachments: attachments,
// }).save()