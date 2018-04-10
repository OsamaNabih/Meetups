const MeetupModel = require('../models/meetup');
const DB = require('../config/DB');

module.exports = {
  home: (req, res) =>{
    return new Promise (function(resolve, reject){
      DB.query(MeetupModel.GetAllMeetups(),(error, result)=>{
         if (error){
           reject(error.sqlMessage);
         } else{
           console.log('Meetups retrieved');
            resolve(result);
         }
     });
   });

  },
  Event: (req,res,ID) =>{
    return new Promise (function(resolve, reject){
      DB.query(MeetupModel.GetMeetup(),ID,(error, result)=>{
         if (error){
           reject(error.sqlMessage);
         } else{
           console.log('Meetups retrieved');
            resolve(result);
         }
     });
   });

  }
}
