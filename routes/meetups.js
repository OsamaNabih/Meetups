const router = require('express').Router();
const MeetupsController = require('../controllers/meetups');
const MeetupModel = require('../models/meetup');
const DB = require('../config/DB');
const passport = require('passport');
const passportUser = passport.authenticate('user-local', { session: false })
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});

router.route('/')
  .get(passportUser, (req, res)=>{
   var result = MeetupsController.GetAllMeetups(req, res);
   result.then(function(result){
     res.render('Events', {meetups: result, userType: req.user.userType});
   }).catch(error =>{
     res.send(error);
   });
  });

module.exports = router;
