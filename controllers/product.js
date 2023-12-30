const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const moment = require('moment');

const Trip = require("../models/trips");
const User = require("../models/user");
const { handleError, handleSuccess } = require("../utils/handleResponse");

exports.getTripById = (req, res, next, id) => {
  Trip.findById(id)
    .populate("categry", "_id name")
    .exec((err, trip) => {
      if (err || !trip) return handleError(res, "Could not find user!", 400);
      req.trip = trip;
      next();
    });
};

// exports.createTrip = (req, res,) => {
//   const form = formidable.IncomingForm();
//   form.keepExtensions = true;

//   form.parse(req, (err, fields, files) => {
//     if (err) return handleError(res, "Could not process data!!", 400);

//     // const userId =req.params.userId;

//     // if (!userId){
//     //   return handleError(res, "User not found in localStorage!", 404);
//     // }

//     // User.findById(userId)
//     // .populate("user", "_id name")
//     // .exec((err, user) => {
//     //   if (err) return handleError(res, "Orders not found!", 400);


//     const trip = new Trip(fields);

//     const { name, category, tripNumber,  trips_details } = fields;

//     if (!name || !category || !tripNumber || !trips_details)
//       return handleError(res, "Please include all fields!", 400);


//     trip.save((err, trip) => {
//       if (err) return handleError(res, "Could not save trip!", 400);
//       res.json(trip);
//       console.log(trip, "A")

      
//     });

    
//   });
// }

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

    const StartTime = moment()
    const EndTime = moment();

    const elapsedTime = EndTime.diff(StartTime, 'milliseconds');

    console.log(`[${moment().format('DD/MM/YYYY HH:mm:ss')}] ${req.method} ${req.url} - Status: ${res.statusCode} - Time taken: ${elapsedTime}ms`);
    

//     Trip.trips_details.StartTime = moment(req.body.trips_details.StartTime).format('YYYY-MM-DD HH:mm:ss');
// Trip.trips_details.EndTime = moment(req.body.trips_details.EndTime).format('YYYY-MM-DD HH:mm:ss');

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a new trip with user information
    const trip = new Trip({
      userId: userId,
      ...req.body,
    });

    // Save the trip to the database
    const savedTrip = await trip.save();

    res.json(savedTrip);
  } catch (error) {
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

exports.getAllTrip = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Trip.find()
    // .select("-photo")
    .limit(limit)
    .sort([[sortBy, "asc"]])
    .populate("category")
    .exec((err, trip) => {
      if (err) return handleError(res, "Could not fetch trip!", 400);
      res.json(trip);
    });
};

// exports.updateTrip = (req, res) => {
//   const form = formidable.IncomingForm();
//   form.keepExtensions = true;

//   form.parse(req, (err, fields, files) => {
//     if (err) return handleError(res, "Could not process data!!", 400);


//     Trip.findByIdAndUpdate(
//       req.trip._id,
//       { $set: fields },
//       { new: true, useFindAndModify: false },
//       (err, trip) => {
//         if (err) return handleError(res, "Could not update trip!", 400);
//         else res.json(trip);
//       }
//     );
//   });
// };

// exports.updateTrip = (req, res) => {
//   const trip = req.trip;
//   const tripId = req.params.tripId;
//   const userId = req.params.userId;

//   User.findById(userId, (err, user) => {
//     if (err || !user) {
//       return res.status(400).json({
//         error: 'Could not find user!',
//       });
//     }

//   Trip.findByIdAndUpdate(
//     tripId,
//     { $set: req.body },
//     { new: true, useFindAndModify: false },
//     (err, trip) => {
//       if (err) {
//         return res.status(400).json({
//           error: 'Error updating trip',
//         });
//       }
//       res.json(trip)
//     }
//   )
// })
// }

// exports.updateTrip = (req, res) => {
//   const user = req.params.userId
//   const trip = req.params.tripId
//   const fields = req.body;
//   console.log(user, "96")
//   console.log(trip, "95")
//   Trip.findOneAndUpdate(
//     { _id: trip, user: user },
//     { $set: fields },
//     { new: true, useFindAndModify: false },
//     (err, updatedTrip) => {
//       if (err) {
//         return handleError(res, "Could not update trip!", 400);
//       }
//       if (!updatedTrip) {
//         return res.status(404).json({
//           error: 'Trip not found for the given user.',
//         });
//       }
//       res.json(updatedTrip);
//     }
//   );
// };


exports.updateTrip = (req, res) => {
  const userId = req.params.user._id;
  console.log(userId, "TT")
  const tripId = req.params.tripId;
  console.log(tripId, "YY")
  const fields = req.body; // Assuming `fields` contains the fields you want to update

  // Check if the user exists
  User.findById(userId, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'Could not find user!',
      });
    }

    // Update the trip if the user exists
    Trip.findOneAndUpdate(
      { _id: tripId, user: userId },
      { $set: fields },
      { new: true, useFindAndModify: false },
      (err, updatedTrip) => {
        if (err) {
          return handleError(res, "Could not update trip!", 400);
        }
        if (!updatedTrip) {
          return res.status(404).json({
            error: 'Trip not found for the given user.',
          });
        }
        res.json(updatedTrip);
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
