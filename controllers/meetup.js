const MeetupModel = require('../models/meetup');
const Database = require('../config/DB');
const config = require('../config/keys').config;

module.exports = {
  GetMeetupAndSpeakers: (id) =>{
    return new Promise(function(resolve, reject){
      DB = new Database(config);
      console.log(DB);
      let meetup, speakers, attendees;
      DB.query(MeetupModel.GetMeetup(), id).then( result =>{
        if (result.length == 0)
          throw 'No meetup exists with this ID';
        meetup = result[0];
        return DB.query(MeetupModel.GetSpeakers(), id);
      }).then(result =>{
        speakers = result;
        return DB.query(MeetupModel.GetAttendees(), id);
      }).then(result =>{
        attendees = result;
        DB.close();
        resolve({meetup: meetup, speakers: speakers, attendees: attendees});
      },err => {
        return DB.close().then( () => { throw err; } )
      }).catch(error =>{
        reject(error);
      });
    });
  }
}
