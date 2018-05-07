module.exports = {
  GetAllMeetups: function(){
    return "SELECT * FROM meetups ORDER BY meetupDate DESC";
  },
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
          FROM (attended JOIN meetups ON attendedMeetupId = meetupId) JOIN users ON userId = userId
          WHERE meetupId = ?`;
  },
  GetVerifiedAttendees: function(){
    return `SELECT userId, email, firstName, lastName, position
          FROM (attended JOIN meetups ON attendedMeetupId = meetupId) JOIN users ON userId = userId
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
            WHERE FQ.meetupId = ?
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
  */  GetFeedBackQuestions: function(){
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
              on FQ.meetupId = Options.meetupId AND FQ.questionId = Options.questionId and FQ.feedback= true
              WHERE FQ.meetupId = ?
              ORDER BY FQ.questionId`;
    },

  CheckPreviousFeedbackSubmission: function(){           // not sure from the query
      return `SELECT Distinct userId,meetupId From FormReplies as FR Natural JOIN
              (Select *
               From FormQuestions
               where feedback = true) as questions
               Where  meetupId= ? and userId = ? `;
    },
  CheckPreviousFeedbackOptionsSubmission: function(){
    return `SELECT Distinct userId,meetupId From FormOptionReplies as FR Natural JOIN
            (Select *
             From FormQuestions
             where feedback = true) as question
             Where  meetupId= ? and userId = ? `;
  },
  GetFeedBackReplies: function()
  {
    return " Select Distinct userId,userReply From FormReplies where questionId = ? and meetupId = ? ";
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
             where meetupId = ?   and questionId = ? ) `;
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
    return `UPDATE Attended SET verified = !verified WHERE attendedMeetupId = ? AND userId IN (?)`;
  },
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
    return `UPDATE Meetups SET meetupId = ?, meetupName = ?, capacity = ?, description = ?, price = ?,
            venue = ?, meetupDate = ?, startTime = ?, endTime = ?, longitude = ?, latitude = ?, slogan = ?`;
  },
  AddAttendee: function(){
    return "INSERT INTO Attended SET ?"
  }
}
