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

    // req.body.trips_details.StartTime = moment(req.body.trips_details.StartTime).format('YYYY-MM-DD HH:mm:ss');
    // req.body.trips_details.EndTime = moment(req.body.trips_details.EndTime).format('YYYY-MM-DD HH:mm:ss');

    // const StartTime = moment(req.body.trips_details.StartTime)
    // const EndTime = moment(req.body.trips_details.EndTime);

    // const elapsedTime = EndTime.diff(StartTime, 'milliseconds');

    // console.log(`[${moment().format('DD/MM/YYYY HH:mm:ss')}] ${req.method} ${req.url} - Status: ${res.statusCode} - Time taken: ${elapsedTime}ms`);



    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a new trip with user information
    const trip = new Trip({
      userId: userId,
      categoryId,
      ...req.body,
    });

    // Save the trip to the database
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

// const trip = new Trip(req.body)
// trip.save((err, trip) => {
//   if (err) return handleError(res, "Could not save product!", 400);
//   res.json(trip)
//   console.log(trip, "DD")
// })



// Trip.trips_details.StartTime = moment(trips_details.StartTime).format('YYYY-MM-DD HH:mm:ss');
// Trip.trips_details.EndTime = moment(trips_details.EndTime).format('YYYY-MM-DD HH:mm:ss');
// const{ name, category, tripNumber} = req.body

//   const trip = new Trip({
//     name,
//     category,
//     tripNumber,
//     tripData, 
//   });

//   trip.save((err, savedTrip) => {
//     if (err) {
//       console.error(err)
//       return res.json({message: "Unable to save trip"})
//     }
//     res.json(savedTrip)
//   })
// }





exports.getTrip = (req, res) => {
  const trip = req.trip;
  // product.photo = undefined;
  return res.send(trip);
};

exports.getAllTrip = async (req, res) => {
  try {

    // Trip.find().exec((err, trips) => {
    //   if (err) return handleError(res, "Could not get categories!", 400);
    //   res.json(trips);
    //   console.log(trips, "136")
    // });
    const pipeline = [
      {
        $match: {} 
      }
    ]

    const TotalTrips = await Trip.aggregate(pipeline)
    console.log(TotalTrips , "TotalTrips") //all 12 trips in this
    console.log(pipeline, "144") // $match in this pipeline

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
  const fields = req.body; // Assuming `fields` contains the fields you want to update
  console.log("Updating trip with fields:", fields);

  // Check if the user exists
  User.findById(userId, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'Could not find user!',
      });
    }

    // Update the trip if the user exists
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
  Trip.findByIdAndDelete(req.trip._id, (err, trip) => {
    if (err) return handleError(res, "Could not delete product!", 400);
    else return handleSuccess(res, `Succesfully deleted ${trip.name}!`);
  });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, categories) => {
    if (err || !categories)
      return handleError(res, "Could not fetch categories!", 400);

    res.json(categories);
  });
};

// exports.getPhoto = (req, res, next) => {
//   if (req.product.photo.data) {
//     res.set("Content-Type", req.product.photo.contentType);
//     return res.send(req.product.photo.data);
//   }
//   next();
// };

exports.updateInventory = (req, res, next) => {
  const bulkProductQueries = req.body.order.products.map((product) => {
    return {
      updateOne: {
        filter: { _id: product._id },
        update: { $inc: { stock: -product.count, sold: +product.count } },
      },
    };
  });

  Product.bulkWrite(bulkProductQueries, {}, (err) => {
    if (err) return handleError(res, "Could not bulk update inventory!", 400);
    next();
  });
};
