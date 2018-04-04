const MeetupModel = require('../models/meetup');
const DB = require('../config/DB');

module.exports = {
  GetMeetupAndSpeakers: (id) =>{
    return new Promise (function(resolve, reject){
      return new Promise (function(resolve, reject){
        DB.query(MeetupModel.GetMeetup(), id, (error, result)=>{
         console.log('Meetup retrieved');
         if (error){
           reject(error);
         }
         resolve(result);
       });
     }).then(function(result){
       return new Promise(function(resolve, reject){
         DB.query(MeetupModel.GetSpeakers(), id, (error, innerResult)=>{
           console.log('Speakers retrieved');
           if (error){
             reject (error);
           }
           //const innerJson = {meetup: result[0], speakers: innerResult};
           const results = [result, innerResult];
           resolve(results);
         });
       });
     }).then(function(results){
        DB.query(MeetupModel.GetAttendees(), id, (error, lastResult)=>{
          console.log('Attendees retrieved');
          if (error){
            reject(error);
          }
          const json = {meetup: results[0][0], speakers: results[1], attendees: lastResult};
          DB.end(()=>{
            console.log('MySQL connection closed');
          });
          resolve(json);
        });
     }).catch(function(error){
       reject(error);
     });
   });
  }
}
