const MeetupModel = require('../models/meetup');
const Database = require('../config/DB');
const DBconfig = require('../config/keys').DBconfig;
module.exports = {
  GetAllMeetups: async (req, res) =>{
    try{
      const DB = new Database(DBconfig);
      let meetups = await DB.query(MeetupModel.GetAllMeetups());
      let numberOfUsers = await DB.query(MeetupModel.GetCountOfAllUsers());
      let numberOfMeetups = await DB.query(MeetupModel.GetCountOfALLMeetups());
      meetups['numberOfUsers'] = numberOfUsers[0].userCount;
      meetups['numberOfMeetups'] = numberOfMeetups[0].meetupCount;
      return meetups;
    }
    catch(error)
    {
      console.log(error);
      throw error;
    }
  }
}
