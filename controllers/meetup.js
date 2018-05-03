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
        return DB.query(MeetupModel.GetVerifiedAttendees(), id);
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
  GetAttendees: async (req, res)=>{
    try {
      const DB = new Database(DBconfig);
      let result = await DB.query(MeetupModel.GetAttendees(), req.params.id);
      DB.close().then(()=> {console.log('DB is closed')});
      return result;
    }
    catch(error){
      return error;
    }

  },
   CreateMeetup: async (req, res)=>{
    //Assuming time format is HH:MM:SS, we concatenate them to insert into DB as HHMMSS
    /*If the format is HH:MM, it must be inserted into the DB as HHMM00 not HHMM or else
    MYSQL interprets it as MM:SS*/
    try{
      req.body.EventInformation.startTime += '00';
      req.body.EventInformation.endTime += '00';
      req.body.EventInformation.startTime = Number(req.body.EventInformation.startTime.split(":").join(""));
      req.body.EventInformation.endTime = Number(req.body.EventInformation.endTime.split(":").join(""));
      req.body.EventInformation.meetupDate = Number(req.body.EventInformation.meetupDate.split("-").join(""));
      const DB = new Database(DBconfig);
      let meetupResult = await DB.query(MeetupModel.InsertMeetup(), req.body.EventInformation)
      let meetupId = meetupResult.insertId;
      let questionsNum = Object.keys(req.body.Questions).length;
      for(let i = 1; i <= questionsNum;i++){
        questionId = i;
        let currQuestion = req.body.Questions[i - 1];
        currQuestion['questionId'] = questionId;
        currQuestion['meetupId'] = meetupId;
        if (currQuestion.questionType === 1){
          await DB.query(MeetupModel.InsertQuestion(), currQuestion);
        }
        else {
          const Options = currQuestion.Answers.split("|");
          delete currQuestion["Answers"];
          let result = await DB.query(MeetupModel.InsertQuestion(), currQuestion);
          for(let j = 1; j <= Options.length; j++){
            let currOption = {meetupId: currQuestion.meetupId, questionId: currQuestion.questionId,
              optionString: Options[j - 1], optionId: j};
              let innerResult = await DB.query(MeetupModel.InsertOption(), currOption);
              //DB.query(MeetupModel.InsertOption(), currOption).catch((error)=> {throw error;});
          }
        }
      }
      DB.close().then(()=>{
        console.log('kollo tamam');
        res.send('success, nigga');
      });
    }
    catch(error){
      console.log('fel catch');
      console.log(error);
    }
  },
  GetQuestions: async (req, res)=>{
      try {
        const DB = new Database(DBconfig);
        //let paragraphQuestions = await DB.query(MeetupModel.GetParagraphQuestions(), req.params.id);
        let meetup = await DB.query(MeetupModel.GetMeetup(), req.params.id);
        meetup = meetup[0];
        let result = await DB.query(MeetupModel.GetQuestions(), [req.params.id, req.params.id]);
        await DB.close();
        let Questions = [];
        for(let j = 0; j < result.length; j++){
          if (result[j].questionType === 1){
            delete result[j]["optionString"];
            delete result[j]["MAX"];
            delete result[j]["questionId"];
            delete result[j]["optionId"];
            delete result[j]["meetupId"];
            result[j].required = Boolean(result[j].required);
            Questions.push(result[j]);
            continue;
          }
          result[j].Answers = [result[j].optionString];
          let k = 1;
          while (k < result[j].MAX)
          {
            result[j].Answers.push(result[k + j].optionString);
            k++;
          }
          delete result[j]["optionString"];
          delete result[j]["MAX"];
          delete result[j]["questionId"];
          delete result[j]["optionId"];
          delete result[j]["meetupId"];
          result[j].required = Boolean(result[j].required);
          Questions.push(result[j]);
          j += k - 1;
        }
        //console.log(optionQuestions);
        //for(let i = 0; i < result.length; i++){
      //    paragraphQuestions.push(result[i]);
        //}
        //console.log(paragraphQuestions);
        const data = {EventInformation: meetup, Questions: Questions};
        //console.log(paragraphQuestions);
        //console.log(result);
        //console.log(data);
        return data;
      }
      catch(error){
        console.log(error);
        return error;
      }
  },
  ValidateUsers: async(req, res)=>{
    try{
      if (req.body.verifiedUsers.length === 0){
        console.log('no change');
        throw 'no change';
      }
      let Ids = [];
      for(let i = 0; i < req.body.verifiedUsers.length; i++){
        //delete req.body.verifiedUsers[i]['verified'];
        Ids.push(req.body.verifiedUsers[i].userId);
      }
      const DB = new Database(DBconfig);
      let result = await DB.query(MeetupModel.VerifyAttendees(), [req.body.meetupId, Ids]);
      console.log(result);
      await DB.close();
      return;
    }
    catch(error){
      throw error;
    }
  }
}
