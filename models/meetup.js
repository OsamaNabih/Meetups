module.exports = {
  GetAllMeetups:  function(){
    return "Select * From Meetups";
  },
  GetMeetup:  function(){
    return "Select * From Meetups WHERE MeetupID = ?";
  }
}
