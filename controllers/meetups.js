<<<<<<< HEAD
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

  }
}
||||||| merged common ancestors
=======
const MeetupModel = require('../models/meetup');
const Database = require('../config/DB');
const DBconfig = require('../config/keys').DBconfig;
module.exports = {
  GetAllMeetups: async (req, res) =>{
    try{
      const DB = new Database(DBconfig);
      let meetups = await DB.query(MeetupModel.GetAllMeetups());
      return meetups;
    }
    catch(error)
    {
      console.log(error);
      throw error;
    }
  }
}
>>>>>>> merged
