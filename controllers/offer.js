const Booking = require('../models/booking');
const Offer = require("../models/offer");
const { validationResult } = require('express-validator');
const User = require("../models/user")
const mongoose = require('mongoose');
const moment = require('moment')

exports.bookOffer = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      
      const { couponCode,  DestinationA, DestinationB, Price, EndDate, Message } = req.body;
      const { userId } = req.params;
  
      console.log('Request Body:', req.body);
     
  
      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({error: 'User not found'})
      }

      // EndDate = new Date(EndDate)
  
      const offer = new Offer({
        userId: userId,
        couponCode,
        route_details: {
          DestinationA,
          DestinationB,  
          Price,
          Message,
          EndDate,
          
        },
        ...req.body
      });

      offer.route_details.EndDate = new Date(offer.route_details.EndDate)
  
    
      const savedOffer = await offer.save();
      console.log('Saved Booking:', savedOffer);
  
      
  
      res.json(savedOffer);
      console.log(savedOffer, "84")
    } catch (error) {
      console.error('Error booking trip:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.getAllOffer = async (req, res) => {
    try {
      const pipeline = [
        {
          $match: {} 
        }
      ]
  
      const TotalOffers = await Offer.aggregate(pipeline)
      console.log(TotalOffers , "TotalOffers") 
      console.log(pipeline, "144") 
  
       pipeline.push(
        { $skip: JSON.parse(req.query.page) > 0 ? ((JSON.parse(req.query.page) - 1) * 5) : 0 },
        { $limit: 5 },
       )
  
      const result = await Offer.aggregate(pipeline)
      console.log(result, "149") 
      console.log(pipeline, "158") 
  
      res.json({
        offer: result,
        totalOffers: TotalOffers.length,
  
      })
     
  
    } catch (error) {
      await logger.createLogger(error.message, "trips", "getAllTrip")
      res.json(error.message)
    }
  
  
  
  };

  exports.updateOffer = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {

      const { userId } = req.params;
      const {offerId} = req.params
      const fields = req.body; 

      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({error: 'User not found'})
      }

      Offer.findOneAndUpdate(
        { _id: offerId },
        { $set: fields },
        { new: true, useFindAndModify: false },
        (err, updatedOffer) => {
          console.log("Fields to update:", fields);
          console.log("Updated offer:", updatedOffer);
          if (err) {
            console.error('Error updating trip:', err);
            return res.status(404).json({
              error: 'Could not update the Offer',
            });
          }
          if (!updatedOffer) {
            return res.status(404).json({
              error: 'Offer not found for the given user.',
            });
          }
          res.json(updatedOffer);
          console.log(updatedOffer)
        }
      );





    }catch (error) {
      console.error('Error booking trip:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  exports.getOfferById = (req, res, next, id) => {
    Offer.findById(id).exec((err, offer) => {
      if(err) {
        return res.status(400).json({
            error: "Can't Find Category"
        })
    }
      req.offer = offer;
      next();
    });
  };

  exports.getOffer = (req, res) => {
    return res.json(req.offer)
}