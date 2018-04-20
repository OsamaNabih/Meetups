const router = require('express').Router();
const passport = require('passport');
const DB = require('../config/DB');
const MeetupController = require('../controllers/meetup');
const MeetupModel = require('../models/meetup');
const passportJWT = passport.authenticate('jwt', { session: false });
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const passportAdmin = passport.authenticate('admin-local', { session: false })
const passportUser = passport.authenticate('user-local', { session: false })

router.route('/create')
  .get((req, res)=>{ //passport strategy here to make sure only admin has access
    res.render('AddPage')
  })
  .post(urlencodedParser, MeetupController.CreateMeetup);

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
