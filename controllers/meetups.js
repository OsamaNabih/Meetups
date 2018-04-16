const MeetupModel = require('../models/meetup');
const Database = require('../config/DB');
const DBconfig = require('../config/keys').DBconfig;
module.exports = {
  GetAllMeetups: (req, res) =>{
    return new Promise (function(resolve, reject){
      const DB = new Database(DBconfig);
      DB.query(MeetupModel.GetAllMeetups(),(error, result)=>{
         if (error){
           DB.close().then(()=>{
             reject(error.sqlMessage);
           });
         } else{
           DB.close().then(()=>{
             console.log('Meetups retrieved');
              resolve(result);
             });
         }
     });
   });
  }
}
