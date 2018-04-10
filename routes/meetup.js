const router = require('express').Router();
const MeetupController = require('../controllers/meetup');
const MeetupModel = require('../models/meetup');
const DB = require('../config/DB');

router.route('/:id')
  .get((req, res) =>{
    var result = MeetupController.GetMeetupAndSpeakers(req.params.id);
    result.then(function(result){
      res.render('Event', {data: result});
    }).catch(function(error){
      //res.sendStatus(error);
      res.send(error);
    });
  });

module.exports = router;
