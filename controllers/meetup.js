const MeetupModel = require('../models/meetup');
const Database = require('../config/DB');
const DBconfig = require('../config/keys').DBconfig;

module.exports = {
  GetMeetupAndSpeakers: (req, res) =>{
    return new Promise(function(resolve, reject){
      const DB = new Database(DBconfig);
      let meetup, speakers, attendees;
      DB.query(MeetupModel.GetMeetup(), req.params.id).then(result =>{
        if (result.length == 0)
          throw 'No meetup exists with this ID';
        meetup = result[0];
        return DB.query(MeetupModel.GetSpeakers(), req.params.id);
      }).then(result =>{
        speakers = result;
        return DB.query(MeetupModel.GetVerifiedAttendees(), req.params.id);
      }).then(result =>{
        attendees = result;
        console.log('you made it');
        return DB.query(MeetupModel.IsAttended(), [req.user.userId, req.params.id]);
      }).then(result =>{
        console.log('reached');
        Registered = Boolean(result.length);
        DB.close().then( ()=>{ resolve({meetup: meetup, speakers: speakers, attendees: attendees, Registered: Registered}); } );
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
      await DB.close();
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
     if (req.body.EventInformation.startTime.length > 5){
       req.body.EventInformation.startTime += '00';
     }
     if (req.body.EventInformation.endTime.length > 5){
       req.body.EventInformation.endTime += '00';
     }
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
       currQuestion['feedback'] = false;
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
         }
       }
     }
     await DB.close();
     return {meetupId: meetupId, message:'Meetup has been created successfully'};
   }
   catch(error){
     console.log(error);
     throw error;
   }
 },
  GetQuestions: async (req, res)=>{
      try {
        const DB = new Database(DBconfig);
        //let paragraphQuestions = await DB.query(MeetupModel.GetParagraphQuestions(), req.params.id);
        let meetup = await DB.query(MeetupModel.GetMeetup(), req.params.id);
        meetup = meetup[0];
        let result = await DB.query(MeetupModel.GetQuestions(), [req.params.id, req.params.id,0]);
        await DB.close();
        let Questions = [];
        for(let j = 0; j < result.length; j++){
          if (result[j].questionType === 1){
            delete result[j]["optionString"];
            delete result[j]["MAX"];
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
          delete result[j]["optionId"];
          delete result[j]["meetupId"];
          result[j].required = Boolean(result[j].required);
          Questions.push(result[j]);
          j += k - 1;
        }
        const data = {EventInformation: meetup, Questions: Questions};
        return data;
      }
      catch(error){
        return error;
      }
  },
  ValidateUsers: async(req, res)=>{
    try{
      if (req.body.verifiedUsers.length === 0){
        throw 'no change';
      }
      let Ids = [];
      for(let i = 0; i < req.body.verifiedUsers.length; i++){
        Ids.push(req.body.verifiedUsers[i].userId);
      }
      const DB = new Database(DBconfig);
      let result = await DB.query(MeetupModel.VerifyAttendees(), [req.body.meetupId, Ids]);
      await DB.close();
      return;
    }
    catch(error){
      throw error;
    }
  },
  SubmitReplies: async(req, res)=>{
    try{
      //Currenyl hardcoding the user ID and question types until the front-end sends them
      let JSON = req.body;
      console.log(JSON);
      const DB = new Database(DBconfig);
      let previousOptionsSubmission = await DB.query(MeetupModel.CheckPreviousOptionsSubmission(),
                                    [JSON.meetupId, req.user.userId]);
      let previousRepliesSubmission = await DB.query(MeetupModel.CheckPreviousRepliesSubmission(),
                                    [JSON.meetupId, req.user.userId]);
      if (previousOptionsSubmission.length !== 0 || previousRepliesSubmission.length !== 0)
      {
        //This user already registered for the meetup
        throw 'You have already registered for this meetup';
      }
      for(let i = 0; i < JSON.Questions.length; i++){
        if(Number(JSON.Questions[i].questionType) !== 1){
          let result = await DB.query(MeetupModel.InsertFormOptionReply(),
                                        {meetupId: Number(JSON.meetupId),
                                         questionId: JSON.Questions[i].questionId, //REMOVE THE +1
                                         userId: req.user.userId,
                                         optionId: JSON.Questions[i].Answer + 1});  //Remove when fixed on front
        }
        else{
          let result = await DB.query(MeetupModel.InsertFormReply(),
                                        {meetupId: Number(JSON.meetupId),
                                         questionId: JSON.Questions[i].questionId, //REMOVE THE +1
                                         userId: req.user.userId,
                                         userReply: JSON.Questions[i].Answer});
        }
      }
      let result =  await DB.query(MeetupModel.AddAttendee(), {userId: req.user.userId, meetupId: JSON.meetupId});
      await DB.close();
      return 'Your registration has been completed successfully';
    }
    catch (error){
      console.log(error);
      throw error;
    }
  },
  UpdateMeetup: async (req, res)=>{
    try{
      let JSON = req.body.EventInformation;
      const DB = new Database(DBconfig);
      let result = await DB.query(MeetupModel.UpdateMeetup(), [JSON.meetupId, JSON.meetupName, JSON.capacity,
                            JSON.descrption, JSON.price, JSON.venue, JSON.meetupDate, JSON.startTime,
                            JSON.endTime, JSON.longitude, JSON.latitude, JSON.slogan]);
      await DB.close();
      return 'Meetup has been updated successfully';
    }
    catch(error){
      console.log(error);
      throw error;
    }
  },
}
