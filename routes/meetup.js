const router = require('express').Router();
const MeetupController = require('../controllers/meetup');
const MeetupModel = require('../models/meetup');
const DB = require('../config/DB');

router.route('/:id')
  .get((req, res) =>{
    var result = MeetupController.GetMeetupAndSpeakers(req.params.id);
    result.then(function(result){
      res.send(result);
    }).catch(function(error){
      console.log(error.message);
    });
  });

module.exports = router;
