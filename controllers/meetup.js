const MeetupModel = require('../models/meetup');
const Database = require('../config/DB');
const DBconfig = require('../config/keys').DBconfig;

module.exports = {
  GetMeetupAndSpeakers: (id) =>{
    return new Promise(function(resolve, reject){
      const DB = new Database(DBconfig);
      let meetup, speakers, attendees;
      DB.query(MeetupModel.GetMeetup(), id).then(result =>{
        if (result.length == 0)
          throw 'No meetup exists with this ID';
        meetup = result[0];
        return DB.query(MeetupModel.GetSpeakers(), id);
      }).then(result =>{
        speakers = result;
        return DB.query(MeetupModel.GetAttendees(), id);
      }).then(result =>{
        attendees = result;
        DB.close().then( ()=>{ resolve({meetup: meetup, speakers: speakers, attendees: attendees}); } );
      },err => {
        return DB.close().then( () => { throw err; } )
      }).catch(error =>{
        reject(error);
      });
    });
  },
  CreateMeetup: (req, res)=>{
    //Assuming time format is HH:MM:SS, we concatenate them to insert into DB
    req.body.startTime = Number(req.body.startTime.replace(/:/g, ''));
    req.body.endTime = Number(req.body.endTime.replace(/:/g, ''));
    req.body.meetupDate = Number(req.body.meetupDate.replace(/-/g, ''));
  }
}
