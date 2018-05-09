const router = require('express').Router();
const passport = require('passport');
const DB = require('../config/DB');
const MeetupController = require('../controllers/meetup');
const MeetupModel = require('../models/meetup');
const passportJWT = passport.authenticate('jwt', { session: false });
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
//const passportAdmin = passport.authenticate('admin-local', { session: false })
const passportAdmin = require('../passport').passportAdmin;
//const passportUser = passport.authenticate('user-local', { session: false })
const passportUser = require('../passport').passportUser;
//const feedbackController = require('../controllers/feedback');

router.route('/create')
  .get(passportAdmin, (req, res)=>{ //passport strategy here to make sure only admin has access
    res.render('AddPage', {userType: req.user.userType});
  })
  .post(passportAdmin, urlencodedParser, (req, res)=>{
    let result =  MeetupController.CreateMeetup(req, res);
    result.then((result)=>{
      res.status(200).json(result);
    }).catch((error)=>{
      res.status(400).json(error);
    });
  });

router.route('/:id/validate')
  .get(passportAdmin, (req, res)=>{
    let result = MeetupController.GetAttendees(req, res);
    result.then(result=>{
      res.render('Validateuser', {data: result, meetupId: req.params.id, userType: req.user.userType});
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
      res.render('Form',{data:result,feedback:undefined, userType: req.user.userType});
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
      res.render('AddFeedback',{meetupId:req.params.id, userType: req.user.userType});
  })
  .post(passportAdmin, (req,res)=>{
    let result = MeetupController.CreateFeedbackQuestions(req,res);
    result.then(()=>{
      res.status(200);
    }).catch((error)=>{
      res.status(400);
    });
  });

//test get feedback question with answers put by the admin
router.route('/:id/feedback')
  .get(passportUser, (req,res)=>{
    let data = MeetupController.GetFeedBackQuestions(req,res);
    data.then((data)=> {
      res.render('Form',{data:data, feedback:1, userType: req.user.userType});
    }).catch((error)=>{
      res.status(400).json(error);
    });
  })
  .post(passportUser, (req,res)=>{
      let result = MeetupController.SubmitFeedbackReplies(req,res);
      result.then((result)=>{
        res.status(200).json(result);
      }).catch((error)=>{
        res.status(400).json(error);
      });
  });


//test get feedback questions with answers put by the Users

router.route('/:id/getFeedbackReplies')
  .get(passportAdmin, (req,res)=>{
    console.log('hena');
    let result = MeetupController.GetFeedBackQuestionswithreplies(req,res);
    result.then((result)=>{
     res.render('GetFeedback',{data:result, userType: req.user.userType});
    }).catch((error)=>{
      res.status(400).json(error);
    });
  });



router.route('/:id/edit')
  .get(passportAdmin, (req, res) =>{
    let result = MeetupController.GetQuestions(req,res);
    result.then(function(result){
      res.render('EditPage', {data: result, userType: req.user.userType});
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
  .get(passportUser, (req, res) =>{
    let result = MeetupController.GetMeetupAndSpeakers(req, res);
    result.then(function(result){
      res.render('Event', {data: result, userType: req.user.userType});
    }).catch(function(error){
      res.send(error);
    });
  });



module.exports = router;
