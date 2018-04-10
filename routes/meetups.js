const router = require('express').Router();
const MeetupsController = require('../controllers/meetups');
const MeetupModel = require('../models/meetup');
const DB = require('../config/DB');

router.route('/')
  .get((req, res)=>{
     res.render('MainPage');
   });

module.exports = router;
