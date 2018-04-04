const router = require('express').Router();
const MeetupsController = require('../controllers/meetups');
const MeetupModel = require('../models/meetup');
const DB = require('../config/DB');

router.route('/')
  .get((req, res)=>{
   var result = MeetupsController.GetAllMeetups(req, res);
   result.then(function(result){
     res.send(result);
   });
  });

module.exports = router;
