const mongoose = require('mongoose');
const Game = require('../models/games');
const Slip = require('../models/betSlip');
const User = require('../models/user');
const axios = require('axios');
const cron = require('node-cron');
require('dotenv').config();

mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
).then(() => {

  User.aggregate([
    {
      $lookup:
        {
          from: 'betslips',
          pipeline: [
            { $match:
                { $eq: ["$userID", "$user_id"] }
            }
          ],
          as: 'bets'
        }
    }, (err, docs) => {
      console.log(err)
      console.log(docs)
    }
  ])
});
