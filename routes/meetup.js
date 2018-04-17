const router = require('express').Router();
const passport = require('passport');
const DB = require('../config/DB');
const MeetupController = require('../controllers/meetup');
const MeetupModel = require('../models/meetup');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/create')
  .get(passportJWT, (req, res)=>{
    res.send('Consider the create meetup page is rendered')
  });

router.route('/:id')
  .get((req, res) =>{
    var result = MeetupController.GetMeetupAndSpeakers(req.params.id);
    result.then(function(result){
      res.render('Event', {data: result});
    }).catch(function(error){
      res.send(error);
    });
  });


module.exports = router;
