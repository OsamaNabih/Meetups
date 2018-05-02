module.exports = {
  GetAllMeetups: function(){
    return "Select * From meetups ORDER BY meetupDate DESC";
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
          FROM (attended JOIN meetups ON attendedMeetupId = meetupId) JOIN users ON userId = attendeeId
          WHERE meetupId = ?`;
  },
  GetVerifiedAttendees: function(){
    return `SELECT userId, email, firstName, lastName, position
          FROM (attended JOIN meetups ON attendedMeetupId = meetupId) JOIN users ON userId = attendeeId
          WHERE meetupId = ? AND verified = true`;
  },
  InsertMeetup: function(){
    return "Insert Into Meetups set ?";
  },
  InsertQuestion: function(){
    return "Insert Into FormQuestions set ?";
  },
  InsertOption: function(){
    return "Insert Into QuestionOptions set ?";
  },
  GetQuestions: function(){
    return `SELECT question, required, FQ.meetupId , FQ.questionId, MAX, optionString, FQ.questionType
            FROM FormQuestions as FQ LEFT JOIN
	             (SELECT * FROM questionoptions NATURAL JOIN
		                (SELECT questionId, meetupId, MAX(optionId) as MAX
                    FROM QuestionOptions
                    WHERE meetupId = ?
                    GROUP BY questionId
                    ORDER BY questionId)
                as OptionsNum)
            as Options
            on FQ.meetupId = Options.meetupId AND FQ.questionId = Options.questionId
            WHERE FQ.meetupId = ?
            ORDER BY FQ.questionId`;
  },
  VerifyAttendees: function(){
    return `UPDATE Attended SET verified = !verified WHERE attendedMeetupId = ? AND attendeeId IN (?)`
  }
}
