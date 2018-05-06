const MeetupModel = require('../models/meetup');
const Database = require('../config/DB');
const DBconfig = require('../config/keys').DBconfig;

module.exports= {
  // if it is seprated i should retrieve the maximum number of question id with the same meetup id and put id past that
  CreateFeedbackQuestions: async (req,res)=>{

    try{
        const DB = new Database(DBconfig);
        let feedbackNums = Object.keys(req.body.Questions).length;
          for(let i = 1; i <= feedbackNums;i++){
            let feedbackId = i;
            let currFeedbackQuestion = req.body.Questions[i-1];
            currFeedbackQuestion['questionId'] = feedbackId;
            currFeedbackQuestion['meetupId'] = req.body.id;           // if it is seprated then  i must have the meetup id sent to me
            currFeedbackQuestion['feedback'] = true;
            if (currFeedbackQuestion.questionType === 1){
              await DB.query(MeetupModel.InsertQuestion(), currFeedbackQuestion);
            }
            else{
                const Options = currFeedbackQuestion.Answers.split("|");
                delete currFeedbackQuestion["Answers"];
                await DB.query(MeetupModel.InsertQuestion(), currFeedbackQuestion);
                  for(let j = 1; j <= Options.length;j++){
                    let currOption = {meetupId: currFeedbackQuestion.meetupId, questionId: currFeedbackQuestion.questionId,
                      optionString: Options[j - 1], optionId: j};
                      let innerResult = await DB.query(MeetupModel.InsertOption(), currOption);
                  }
            }

        }
        DB.close().then(()=>{
            console.log('feedback inserted');
            res.send('success, nigga');
          });

      }catch(error){
        console.log('fel catch');
        console.log(error);
    }
  },
  GetFeedBackQuestions: async (req, res)=>{

      try {
        const DB = new Database(DBconfig);
        //let paragraphQuestions = await DB.query(MeetupModel.GetParagraphQuestions(), req.params.id);
        let meetup = await DB.query(MeetupModel.GetMeetup(), req.params.id);
        meetup = meetup[0];
        let result = await DB.query(MeetupModel.GetFeedBackQuestions(), [req.params.id, req.params.id]);
        await DB.close();
        let Questions = [];
        for(let j = 0; j < result.length; j++){
          if (result[j].questionType === 1){
            delete result[j]["optionString"];
          //  delete result[j]["questionId"];
            delete result[j]["Max"];
         //   delete result[j]["optionId"];
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
      //    delete result[j]["questionId"];
      //    delete result[j]["optionId"];
          delete result[j]["meetupId"];
          result[j].required = Boolean(result[j].required);
          Questions.push(result[j]);
          j += k - 1;
        }
        const data = {EventInformation: meetup, Questions: Questions};
        return data;
      }
      catch(error){
        console.log(error);
        return error;
      }
  },
  SubmitFeedbackReplies: async(req, res)=>{
    try{
      //Currenyl hardcoding the user ID and question types until the front-end sends them
      let JSON = req.body;
      JSON.userId = 6;
    /*  JSON.Questions[0].questionType = 2;
      JSON.Questions[1].questionType = JSON.Questions[2].questionType = JSON.Questions[3].questionType = 1;
      JSON.Questions[4].questionType = JSON.Questions[5].questionType = 3;
    */
      const DB = new Database(DBconfig);
      let previousFeedbackSubmission = await DB.query(MeetupModel.CheckPreviousFeedbackSubmission(),
                                    [JSON.meetupId, JSON.userId]);
      let previousFeedbackOptionsSubmission = await DB.query(MeetupModel.CheckPreviousFeedbackOptionsSubmission(),
                                    [JSON.meetupId, JSON.userId]);
      if (previousFeedbackSubmission.length !== 0 || previousFeedbackOptionsSubmission.length !== 0)
      {
        //This user already registered for the meetup
        console.log('Feedback was inserted before ');
        throw 'You have already inserted a feedback for this meetup';
      }
      for(let i = 0; i < JSON.Questions.length; i++){
        if(JSON.Questions[i].questionType !== 1){
          let result = await DB.query(MeetupModel.InsertFormOptionReply(),
                                        {meetupId: Number(JSON.meetupId),
                                         questionId: JSON.Questions[i].questionId, //REMOVE THE +1
                                         userId: JSON.userId,
                                         optionId: JSON.Questions[i].Answer });  //Remove when fixed on front
        }
        else{
          let result = await DB.query(MeetupModel.InsertFormReply(),
                                        {meetupId: Number(JSON.meetupId),
                                         questionId: JSON.Questions[i].questionId , //REMOVE THE +1
                                         userId: JSON.userId,
                                         userReply: JSON.Questions[i].Answer});
        }
      }
      await DB.close();
      return 'Your registration has been completed successfully';
    }
    catch (error){
      console.log(error);
      throw error;
    }
  },

  GetFeedBackQuestionswithreplies: async (req,res)=>
  {
    try{
         let meetupId = req.params.id;
         const DB = new Database(DBconfig);
         let Questions = await DB.query(MeetupModel.GetFeedBackQuestionsOnly(),meetupId);
         console.log(Questions);
         for (var i = 0; i < Questions.length; i++) {
           delete Questions[i]['required'];
           delete Questions[i]['MAX'];
           if(Questions[i].questionType === 1)
            {
              delete Questions[i]['optionString'];
              delete Questions[i]['Options'];
              let replies = await DB.query(MeetupModel.GetFeedBackReplies(),Questions[i].questionId);
              console.log("replies",replies);
              Questions[i].replies = [];
              for (var j = 0; j < replies.length; j++) {
                Questions[i].replies.push(replies[j]);
              }
            }
            else
            {
              let Options = await DB.query(MeetupModel.GetFeedBackOptions(),[meetupId,Questions[i].questionId,meetupId,Questions[i].questionId]);
              Questions[i].Options = [];
              for (var j = 0; j <Options.length; j++) {
                Questions[i].Options.push(Options[j]);
              }
            }
         }

        await DB.close();
        return Questions;
    }
    catch(error){
      console.log(error);
      throw error;
    }

  }
}