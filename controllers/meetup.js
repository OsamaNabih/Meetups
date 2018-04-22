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
   CreateMeetup: async (req, res)=>{
    //Assuming time format is HH:MM:SS, we concatenate them to insert into DB as HHMMSS
    /*If the format is HH:MM, it must be inserted into the DB as HHMM00 not HHMM or else
    MYSQL interprets it as MM:SS*/
    try{
      req.body.EventInformation.startTime += '00';
      req.body.EventInformation.endTime += '00';
      req.body.EventInformation.startTime = Number(req.body.EventInformation.startTime.split(':').join(''));
      req.body.EventInformation.endTime = Number(req.body.EventInformation.endTime.split(':').join(''));
      req.body.EventInformation.meetupDate = Number(req.body.EventInformation.meetupDate.split('-').join(''));
      const DB = new Database(DBconfig);
      let meetupResult = await DB.query(MeetupModel.InsertMeetup(), req.body.EventInformation)
      let meetupId = meetupResult.insertId;
      let questionsNum = Object.keys(req.body.Questions).length;
      let insertions = [];
      let Answers = [];
      for(let i = 1; i <= questionsNum; i++){
        questionId = i;
        let currQuestion = req.body.Questions[i - 1];
        currQuestion['questionId'] = questionId;
        currQuestion['meetupId'] = meetupId;
        if (currQuestion.questionType === 1){
          insertions.push(DB.query(MeetupModel.InsertQuestion(), currQuestion));
          Answers.push('');
        }
        else {
          Answers.push(currQuestion.Answers);
          delete currQuestion["Answers"];
          insertions.push(DB.query(MeetupModel.InsertQuestion(), currQuestion));
        }
      }
      Promise.all(insertions).then((after)=>{
        let optionInsertions = [];
        for(let j = 1; j <= questionsNum; j++){
          let currQuestion = req.body.Questions[j - 1];
          currQuestion['questionId'] = j;
          currQuestion['meetupId'] = meetupId;
          if (currQuestion.questionType !== 1){
            const Options = Answers[j - 1].split("|");
            for(let k = 1; k <= Options.length; k++){
              let currOption = {meetupId: currQuestion.meetupId, questionId: currQuestion.questionId,
              optionString: Options[k - 1], optionId: k};
              optionInsertions.push(DB.query(MeetupModel.InsertOption(), currOption));
            }
          }
        }
        return Promise.all(optionInsertions);
      }).then(()=>{
        return DB.close().then( () => { res.send('success, nigga'); } )
      }).catch( (error)=>{
        throw error;
      });
    }
    catch(error){
      console.log(error);
    }
  }
}
