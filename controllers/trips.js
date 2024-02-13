const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const moment = require('moment');
const logger = require("./logger")

const Trip = require("../models/trips");
const User = require("../models/user");
const { handleError, handleSuccess } = require("../utils/handleResponse");

exports.getTripById = (req, res, next, id) => {
  Trip.findById(id)
    .populate("categry", "_id name")
    .exec(async (err, trip) => {
      if (err || !trip) {
        await logger.createLogger(err.message, "trips", "getTripById")
        return handleError(res, "Could not find user!", 400);
      }
      req.trip = trip;
      next();
    });
};


exports.createTrip = async (req, res) => {
  try {
    // Check if SeatType is a string before splitting
    if (typeof req.body.trips_details.SeatType === 'string') {
      req.body.trips_details.SeatType = req.body.trips_details.SeatType.split(',');
    }

    // Check if TravelClass is a string before splitting
    if (typeof req.body.trips_details.TravelClass === 'string') {
      req.body.trips_details.TravelClass = req.body.trips_details.TravelClass.split(',');
    }

    // Check if PaymentType is a string before splitting
    if (typeof req.body.trips_details.PaymentType === 'string') {
      req.body.trips_details.PaymentType = req.body.trips_details.PaymentType.split(',');
    }

    const { userId } = req.params;
    const { categoryId } = req.body;

  
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const trip = new Trip({
      userId: userId,
      categoryId,
      ...req.body,
    });

   
    const savedTrip = await trip.save();
    // const categorryId = savedTrip.categoryId
    console.log(savedTrip, "2")

    // res.json({
    //   message: "Successfully created Trip",
    //   data: savedTrip,
    //   // categoryId: categorryId
    // });
    res.json({ message: "Successfully created Trip", savedTrip });

  } catch (error) {
    await logger.createLogger(error.message, "trips", "createTrip")
    console.error('Error creating trip:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getTrip = (req, res) => {
  const trip = req.trip;
 
  return res.send(trip);
};

exports.getAllTrip = async (req, res) => {
  try {
    const pipeline = [
      {
        $match: {} 
      }
    ]

    const TotalTrips = await Trip.aggregate(pipeline)
    console.log(TotalTrips , "TotalTrips") 
    console.log(pipeline, "144") 

     pipeline.push(
      { $skip: JSON.parse(req.query.page) > 0 ? ((JSON.parse(req.query.page) - 1) * 5) : 0 },
      { $limit: 5 },
     )

    const result = await Trip.aggregate(pipeline)
    console.log(result, "149") //this has trips according to page 
    //i.e page=1 5 trips, page=2 5 trips page=3 2 trips 
    console.log(pipeline, "158") // $match $skip: 0, $limit:5

    res.json({
      trip: result,
      totalTrips: TotalTrips.length,

    })
   

  } catch (error) {
    await logger.createLogger(error.message, "trips", "getAllTrip")
    res.json(error.message)
  }



};

exports.getEveryTrip = (req, res) => {
  Trip.find().exec((err, trips) => {
    if (err) return handleError(res, "Could not get categories!", 400);
    res.json(trips);
  });
};



exports.updateTrip = (req, res) => {
  const userId = req.params.userId;
  console.log(userId, "TT")
  const tripId = req.params.tripId;
  console.log(tripId, "YY")
  const fields = req.body; 
  console.log("Updating trip with fields:", fields);

  
  User.findById(userId, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'Could not find user!',
      });
    }

   
    Trip.findOneAndUpdate(
      { _id: tripId },
      { $set: fields },
      { new: true, useFindAndModify: false },
      (err, updatedTrip) => {
        console.log("Fields to update:", fields);
        console.log("Updated trip:", updatedTrip);
        if (err) {
          console.error('Error updating trip:', err);
          return handleError(res, "Could not update trip!", 400);
        }
        if (!updatedTrip) {
          return res.status(404).json({
            error: 'Trip not found for the given user.',
          });
        }
        res.json(updatedTrip);
        console.log(updatedTrip)
      }
    );
  });
};


exports.deleteTrip = (req, res) => {
  const {tripId} = req.params

  Trip.findByIdAndDelete(
    { _id: tripId },
    (err, trip) => {
      console.log(trip, "168")
    if (err) {
      console.error('Error updating trip:', err);
      return res.status(404).json({
        error: 'Could not update the trip',
      });
    }
    if (!trip) {
      return res.status(404).json({
        error: 'Trip not found .',
      });
    }
    res.json(trip);
    console.log(trip)
  });
};

