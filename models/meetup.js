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
    return `SELECT userId, email, firstName, lastName, position
          FROM (attended JOIN meetups ON attendedMeetupId = meetupId) JOIN users ON userId = attendeeId
          WHERE meetupId = ?`;
  },
  InsertMeetup: function(){
    return "Insert Into Meetups set ?";
  },
  InsertQuestion: function(){
    return "Insert Into FormQuestions set ?";
  },
  InsertOption: function(){
    return "Insert Into QuestionOptions set ?";
  }
}
