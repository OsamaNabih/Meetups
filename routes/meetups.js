const router = require('express').Router();
const MeetupsController = require('../controllers/meetups');
const MeetupModel = require('../models/meetup');
const DB = require('../config/DB');

router.route('/')
  .get((req, res)=>{
   var result = MeetupsController.GetAllMeetups(req, res);
   result.then(function(result){
     res.render('Events', {meetups: result});
   }).catch(error =>{
     res.send(error);
   });
  });

module.exports = router;
