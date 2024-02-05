const Wallet = require('../models/wallet');
const { validationResult } = require('express-validator');
const User = require("../models/user")
const mongoose = require('mongoose');

exports.wallet = async (req, res) => {
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

    const {type, amount} = req.body

    if (type === 'debit') {
        if (user.ewallet < amount) {
          return res.status(400).json({ error: 'Insufficient balance' });
        } else  {
            await User.findByIdAndUpdate(
                {_id: userId},
                {$inc : {ewallet: -amount}},
                {new: true}
            )
        }
        } else if (type === 'credit') {
            await User.findByIdAndUpdate(
                {_id: userId},
                {$inc : {ewallet: amount}},
                {new: true}
            )
        } else {
            return res.status(400).json({ error: 'Please try again' }); 
        }

        const wallet = new Wallet({
            userId: userId,
            type,
            amount,
        })

        const savedWallet = await wallet.save()

      

        res.json({ 
          error: 'Saved Successfully',
          
        });
        // res.json(pipeline)
      // console.log(pipeline[0], "ZZ")

    }catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
  
}

exports.getTotalWallet = async (req, res) => {
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

      const pipeline = await Wallet.aggregate([
        {
          $match: {
            'userId':  mongoose.Types.ObjectId(req.params.userId),
          }
        },
        {
          $lookup: {
            'from': 'users',
            'localField': 'userId',
            'foreignField': '_id',
            'as':'result'
          }
        },
        {
          '$unwind': {
            'path': '$result'
          }
        },
        // {
        //   $group: {
        //     _id: '$result.ewallet',
        //   },
        // },
        {
          "$project":{
            _id:0, 
            "amount": "$result.ewallet"
          }
        }
      ])

      res.json( pipeline[0]);
      // res.json(pipeline)
    console.log(pipeline[0], "ZZ")

  }catch (error) {
      console.error('Error fetching user bookings:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }

}

    


   


      
  
