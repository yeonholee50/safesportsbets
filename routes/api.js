const router = require('express').Router();
const passport = require('passport')
const BetSlip = require('../models/betSlip');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const Game = require('../models/games')
const Sport = require('../models/sport')
const mongoose = require('mongoose');


router.post('/api/bet', async (req, res) => {
  console.log(req.body.sum)
  console.log('after after')
  if (req.body.betInfo.length > 1) {
    let slips = {}
    BetSlip.insertMany(req.body.betInfo).then((slip) => {
      slips = slip;
      User.findOne({'user_id': slip[0].userID}).then((initial_user) => {
        User.updateOne(
          {'user_id': initial_user.user_id},
          {
            $set: {
              'account_value.pending': initial_user.account_value.pending + parseFloat(req.body.sum),
              'account_value.current': initial_user.account_value.current - parseFloat(req.body.sum)
            },
            $push: {
              'account_value_history.pending': { date: Date.now(), value: initial_user.account_value.pending + parseFloat(req.body.sum) },
              'account_value_history.balance': { date: Date.now(), value: initial_user.account_value.current - parseFloat(req.body.sum) }
            },
          },
          { new: true }
        ).then((hi) => {
          User.findOne({'user_id': initial_user.user_id}).then((finalUser) => {
            return res.json({slip: slips, user: finalUser});
          })
        })
      })
    })
  } else {
    let slips = {}
    BetSlip.create(req.body.betInfo).then((slip) => {
      slips = slip;
      User.findOne({'user_id': slip[0].userID}).then((initial_user) => {
        User.updateOne(
          {'user_id': initial_user.user_id},
          {
            $set: {
              'account_value.pending': initial_user.account_value.pending + parseFloat(req.body.sum),
              'account_value.current': initial_user.account_value.current - parseFloat(req.body.sum)
            },
            $push: {
              'account_value_history.pending': { date: Date.now(), value: initial_user.account_value.pending + parseFloat(req.body.sum) },
              'account_value_history.balance': { date: Date.now(), value: initial_user.account_value.current - parseFloat(req.body.sum) }
            },
            
          },
          { new: true }
        ).then((hi) => {
          User.findOne({'user_id': initial_user.user_id}).then((finalUser) => {
            return res.json({slip: slips, user: finalUser});
          })
        })
      })
    })
  }
});



router.post('/api/bet/bulk', (req, res) => {
  BetSlip.insertMany(req.body)
    .then(async dbSlip => {
      res.json(dbSlip);
      await User.find(
        {
          'user_id': dbBetSlip.userID
        }, async (err, doc) => {
          await User.findOneAndUpdate(
            {'user_id': dbBetSlip.userID},
            {
              $set: {
                'account_value.pending': doc[0].account_value.pending + parseFloat(dbBetSlip.payout.toLose),
                'account_value.current': doc[0].account_value.current - parseFloat(dbBetSlip.payout.toLose)
              }
            },
            { new: true }, async (err, doc) => {
              console.log('2')
              console.log(doc)
              if (!err) {
                await res.json({slip: dbBetSlip, user: doc});
              }
              
            }
          )
          
        }
        
      )

    })
    .catch(err => {
      res.status(404).json(err);
    });
});




router.get('/api/user', (req, res) => {
  User.findOne(
    { 'user_id': req.query.user_id }
  ).then((user) => {
    res.json(user)
  }).catch((err) => {
    res.status(400).json(err);
  })
})

router.get('/api/bet', (req, res) => {
  
  BetSlip.find({
    'userID': req.query.userId
  }).then(dbBetSlip => {
      res.json(dbBetSlip);
    }).catch(err => {
      res.status(400).json(err);
    });
});

router.post('/signup', (req, res) => {
  const Users = new User({
    username: req.body.email,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    zipcode: req.body.zipcode
  });

  User.register(Users, req.body.password, function(err, user) {
    if (err) {
      res.json({success: false, message:"creation unsuccessful", err});
    } else {
      
      res.json({success: true, message:'creation successful', user});
    }
  });
});

router.post('/login', (req, res) => {
  passport.authenticate('local', async (err, user, info) => {
    if (err) {
      res.json({success: false, message: err})
    } else if (!user) {
      res.json({success: false, message: 'username or pass incorrect'})
    } else {
      const token = jwt.sign({username: user.username}, 'shhhh', {expiresIn: '1h'});
      await BetSlip.find({
        'userID': user.user_id
      }).then(dbBetSlip => {
          user['slips'] = dbBetSlip;
          
          res.json({success: true, message: "authentication successful", token, user, dbBetSlip});
          
        })
        .catch(err => {
          res.status(400).json(err);
        });
    }
  }) (req, res);
});

module.exports = router;
