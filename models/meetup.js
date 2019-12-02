module.exports = {
  GetAllMeetups: function(){
    return `SELECT meetupName, slogan, meetupId, meetupDate, district, ticketLink FROM meetups ORDER BY meetupDate DESC`;
  },
  GetCountOfAllUsers: function(){
    return "Select Count(userId) as userCount from Users";
  },
  GetCountOfALLMeetups: function(){
    return `Select Count(meetupId) meetupCount from Meetups`;
  },
  // Bassel starts
  GetSpeakersId: function(){
    return "SELECT * FROM spoke_in WHERE meetupId = ?";
  },
  GetMeetup: function(){
    return "SELECT * FROM meetups WHERE meetupId = ?";
  },
  GetSpeakers: function(){
    return `SELECT userId, email, firstName, lastName, position
            FROM (spoke_in NATURAL JOIN meetups) JOIN users ON userId = speakerId
            WHERE meetupId = ?`;
  },
  GetAttendees: function(){
    return `SELECT userId, email, firstName, lastName, position, verified
          FROM (Attended NATURAL JOIN Meetups) NATURAL JOIN Users
          WHERE meetupId = ?`;
  },
  GetVerifiedAttendees: function(){
    return `SELECT userId, email, firstName, lastName, position
          FROM (Attended NATURAL JOIN Meetups ) NATURAL JOIN Users
          WHERE meetupId = ? AND verified = true`;
  },
  InsertMeetup: function(){
    return "INSERT INTO Meetups SET ?";
  },
  InsertQuestion: function(){
    return "INSERT INTO FormQuestions SET ?";
  },
  InsertOption: function(){
    return "INSERT INTO FormOptions SET ?";
  },
  GetQuestions: function(){
    return `SELECT question, required, FQ.meetupId , FQ.questionId, MAX, optionString, FQ.questionType
            FROM FormQuestions as FQ LEFT JOIN
	             (SELECT * FROM FormOptions NATURAL JOIN
		                (SELECT questionId, meetupId, MAX(optionId) as MAX
                    FROM FormOptions
                    WHERE meetupId = ?
                    GROUP BY questionId
                    ORDER BY questionId)
                as OptionsNum)
            as Options
            on FQ.meetupId = Options.meetupId AND FQ.questionId = Options.questionId
            WHERE FQ.meetupId = ? and FQ.feedback = ?
            ORDER BY FQ.questionId`;
  },
/*  GetFeedBackQuestions: function(){
    return `SELECT question, required, FQ.meetupId, FQ.questionId, optionString, FQ.questionType
            From FormQuestions as FQ LEFT JOIN
            (SELECT * From FormOptions
              WHERE meetupId = ?
              GROUP BY questionId
              ORDER BY questionId)
              as Options
            On FQ.meetupId = Options.meetupId And FQ.questionId= Options.questionId and FQ.feedback = true
            where FQ.meetupId = ?
            ORDER BY FQ.questionId`;
  },
  */ 
 /* GetFeedBackQuestions: function(){
      return `SELECT question, required, FQ.meetupId , FQ.questionId, MAX, optionString, FQ.questionType
              FROM FormQuestions as FQ LEFT JOIN
  	             (SELECT * FROM FormOptions NATURAL JOIN
  		                (SELECT questionId, meetupId, MAX(optionId) as MAX
                      FROM FormOptions
                      WHERE meetupId = ?
                      GROUP BY questionId
                      ORDER BY questionId)
                  as OptionsNum)
              as Options
              on FQ.meetupId = Options.meetupId AND FQ.questionId = Options.questionId
              WHERE FQ.meetupId = ? and FQ.feedback= true
              ORDER BY FQ.questionId`;
    },
    */

  CheckPreviousFeedbackSubmission: function(){           // not sure from the query
      return `SELECT Distinct userId,meetupId From FormReplies as FR Natural JOIN
              (Select *
               From FormQuestions
               where feedback = true) as questions
               Where  meetupId= ? and userId = ? `;
    },
  //Bassel Ends, Osama starts
  CheckPreviousFeedbackOptionsSubmission: function(){
    return `SELECT Distinct userId,meetupId From FormOptionReplies as FR Natural JOIN
            (Select *
             From FormQuestions
             where feedback = true) as question
             Where  meetupId= ? and userId = ? `;
  },
  GetFeedBackReplies: function()
  {
    return `Select userId,userReply,US.email,US.firstName from FormReplies NATURAL JOIN (Select firstName,email,userId from Users) as US 
    NATURAL JOIN (SELECT questionId FROM FormQuestions WHERE feedback = true) as FQ
    where questionId=? and meetupId=?`;
  },
  GetRegisteredChoiceReplies: function()
  {
    return `SELECT questionId,question, optionString,userId,firstName,lastName,email 
            FROM FormOptionReplies NATURAL JOIN FormOptions NATURAL JOIN users NATURAL JOIN FormQuestions 
            WHERE meetupId = ?`;
  },
  GetRegisteredParagraphReplies: function()
  {
    return `SELECT questionId,question, userReply as optionString,userId,firstName,lastName,email 
            FROM FormReplies NATURAL JOIN Users NATURAL JOIN FormQuestions 
            WHERE meetupId = ?`;
  },
  GetFeedBackQuestionsOnly: function()
  {
    return " Select question,questionId,questionType from FormQuestions where meetupId = ? and feedback= true ";
  },
  GetFeedBackOptions: function()
  {
    return `Select optionString,optionId from FormOptions
            where  meetupId = ? and questionId = ? and optionId In
           ( select optionId
             from FormOptionReplies
             where meetupId = ? and questionId = ?) `;
  },
  GetNumberOfMultipleFeedbackQuestions: function()
  {
    return `select Distinct questionId From formoptionreplies where meetupId = ?`;
  },
  GetFeedBackOptionsCount: function()
  {
    return `select optionId
      from FormOptionReplies
      where meetupId = ?   and questionId = ?`;
  },
  GetMaxIdOfQuestions: function()
  {
    return `Select Max(questionId) as questionId From FormQuestions where meetupId =?`;
  },
  VerifyAttendees: function(){
    return `UPDATE Attended SET verified = !verified WHERE meetupId = ? AND userId IN (?)`;
  },
  // Osama Ends, Wagih Begins
  CheckPreviousOptionsSubmission: function(){
    return "SELECT DISTINCT userId FROM FormOptionReplies WHERE meetupId = ? AND userId = ?";
  },
  CheckPreviousRepliesSubmission: function(){
    return "SELECT DISTINCT userId FROM FormReplies WHERE meetupId = ? AND userId = ?"
  },
  InsertFormOptionReply: function(){
    return "INSERT INTO FormOptionReplies SET ?";
  },
  InsertFormReply: function(){
    return "INSERT INTO FormReplies SET ?";
  },
  DeleteMeetup: function(){
    return "DELETE FROM Meetups WHERE meetupId = ?"
  },
  UpdateMeetup: function(){
    return `UPDATE Meetups SET ? WHERE meetupId = ?`;
  },
  AddAttendee: function(){
    return "INSERT INTO Attended SET ?"
  },
  GetTwoMeetups: function(){
    return "SELECT meetupName, slogan, meetupId FROM meetups ORDER BY meetupDate DESC"
  },
  IsAttended: function(){
    return "SELECT userId FROM Attended WHERE userId = ? AND meetupId = ? AND verified = true";
  }
}
