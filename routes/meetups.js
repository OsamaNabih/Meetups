const router = require('express').Router();
const MeetupsController = require('../controllers/meetups');
const MeetupModel = require('../models/meetup');
const DB = require('../config/DB');

router.route('/')
  .get((req, res)=>{
<<<<<<< HEAD
     res.render('MainPage');
   });
||||||| merged common ancestors
    /*
    DB.query(MeetupModel.GetAllMeetups(),(error, result)=>{
       if (error){
         console.log(error.sqlMessage);
       } else{
         console.log('Meetups retrieved');
         res.send(result);
       }
   });
   */
   var result = MeetupsController.home(req, res);
   result.then(function(result){
     res.send(result);
   });
  });
=======
   var result = MeetupsController.GetAllMeetups(req, res);
   result.then(function(result){
     res.send(result);
   });
  });
>>>>>>> back-end

module.exports = router;
