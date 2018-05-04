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
    res.render('AddPage');
  })
  .post(urlencodedParser, MeetupController.CreateMeetup);

router.route('/:id/validate')
  .get((req, res)=>{
    let result = MeetupController.GetAttendees(req, res);
    result.then(result=>{
      res.render('Validateuser', {data: result, meetupId: req.params.id});
    }).catch(error=>{
      res.status(200).json(error);
    })
  })
  .post(urlencodedParser, (req, res)=>{
    let result = MeetupController.ValidateUsers(req, res);
    result.then((result)=>{
      res.status(200).json('Attendees updated');
    }).catch((error)=>{
      res.status(400).json(error);
    });
  });

router.route('/:id/register')
  .get((req, res)=>{
    let result = MeetupController.GetQuestions(req, res);
    result.then(function(result){
      res.render('Form',{data:result});
    }).catch(function(error){
      console.log('barra');
    });
  })
  .post(urlencodedParser, (req, res)=>{
    let result = MeetupController.SubmitReplies(req, res);
    result.then((result)=>{
      res.status(200).json(result);
    }).catch((error)=>{
      res.status(400).json(error);
    });
  });


  router.route('/:id/addFeedback')
  .get((req, res)=>{
      res.render('AddFeedback',{meetupId:req.params.id});
  });



router.route('/:id/edit')
  .get((req, res) =>{
    let result = MeetupController.GetQuestions(req,res);
    result.then(function(result){
      res.render('EditPage', {data: result});
    }).catch(function(error){
      res.send(error);
    });
  })
  .post(urlencodedParser, (req, res)=>{
    let result = MeetupController.UpdateMeetup(req, res);

  });

router.route('/:id')
  .get((req, res) =>{
    let result = MeetupController.GetMeetupAndSpeakers(req.params.id);
    result.then(function(result){
      res.render('Event', {data: result});
    }).catch(function(error){
      res.send(error);
    });
  });


module.exports = router;
