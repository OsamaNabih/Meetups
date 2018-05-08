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
const feedbackController = require('../controllers/feedback');

router.route('/create')
  .get(passportAdmin, (req, res)=>{ //passport strategy here to make sure only admin has access
    res.render('AddPage');
  })
  .post(passportAdmin, urlencodedParser, MeetupController.CreateMeetup);

router.route('/:id/validate')
  .get(passportAdmin, (req, res)=>{
    let result = MeetupController.GetAttendees(req, res);
    result.then(result=>{
         console.log(req.cookies);
      res.render('Validateuser', {data: result, meetupId: req.params.id});
    }).catch(error=>{
      res.status(200).json(error);
    })
  })
  .post(passportAdmin, urlencodedParser, (req, res)=>{
    let result = MeetupController.ValidateUsers(req, res);
    result.then((result)=>{
      res.status(200).json('Attendees updated');
    }).catch((error)=>{
      res.status(400).json(error);
    });
  });

router.route('/:id/register')
  .get(passportUser, (req, res)=>{
    let result = MeetupController.GetQuestions(req, res);
    result.then(function(result){
      console.log(result);
      res.render('Form',{data:result,feedback:undefined});
    }).catch(function(error){
      console.log('barra');
    });
  })
  .post(passportUser, urlencodedParser, (req, res)=>{
    let result = MeetupController.SubmitReplies(req, res);
    result.then((result)=>{
      res.status(200).json(result);
    }).catch((error)=>{
      res.status(400).json(error);
    });
  });


  //test feedback input
  router.route('/:id/addFeedback')
  .get(passportAdmin, (req, res)=>{

      res.render('AddFeedback',{meetupId:req.params.id});
  })
  .post(passportAdmin, (req,res)=>{
    let result = feedbackController.CreateFeedbackQuestions(req,res);
    result.then(()=>{
      res.status(200);
    }).catch((error)=>{
      res.status(400);
    });
  });

//test get feedback question with answers put by the admin
router.route('/:id/feedback')
  .get(passportUser, (req,res)=>{
       console.log(req.cookies);
    let data = feedbackController.GetFeedBackQuestions(req,res);
    data.then((data)=> {
    //  console.log(data);
      res.render('Form',{data:data, feedback:1});
    }).catch((error)=>{
      res.status(400).json(error);
    });
  })
  .post(passportUser, (req,res)=>{
      let result = feedbackController.SubmitFeedbackReplies(req,res);
      result.then((result)=>{
        res.status(200).json(result);
      }).catch((error)=>{
        res.status(400).json(error);
      });
  });


//test get feedback questions with answers put by the Users

router.route('/:id/getFeedbackReplies')
  .get(passportAdmin, (req,res)=>{
    let result = feedbackController.GetFeedBackQuestionswithreplies(req,res);
    result.then((result)=>{
     res.render('GetFeedback',{data:result});
    }).catch((error)=>{
      res.status(400).json(error);
    });
  });



router.route('/:id/edit')
  .get(passportAdmin, (req, res) =>{
    let result = MeetupController.GetQuestions(req,res);
    result.then(function(result){
      res.render('EditPage', {data: result});
    }).catch(function(error){
      res.send(error);
    });
  })
  .post(passportAdmin, urlencodedParser, (req, res)=>{
    let result = MeetupController.UpdateMeetup(req, res);
    result.then((result)=>{
      res.status(200).json(result);
    }).catch((error)=>{
      res.status(400).json(error);
    });
  });

router.route('/:id')
  .get((req, res) =>{
       console.log(req.cookies);
    let result = MeetupController.GetMeetupAndSpeakers(req.params.id);
    result.then(function(result){
      console.log(result);
      res.render('Event', {data: result});
    }).catch(function(error){
      res.send(error);
    });
  });



module.exports = router;
