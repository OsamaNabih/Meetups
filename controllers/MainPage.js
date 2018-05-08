const MeetupModel = require('../models/meetup');
const Database = require('../config/DB');
const DBconfig = require('../config/keys').DBconfig;
module.exports = {
  GetMainPageStats: async (req, res) =>{
    try{
      const DB = new Database(DBconfig);
      let numberOfUsers = await DB.query(MeetupModel.GetCountOfAllUsers());
      let numberOfMeetups = await DB.query(MeetupModel.GetCountOfALLMeetups());
      let upcomingMeetups = await DB.query(MeetupModel.GetAllMeetups());
      let result = {};
      result['numberOfUsers'] = numberOfUsers[0].userCount;
      result['numberOfMeetups'] = numberOfMeetups[0].meetupCount;
      result['upcoming'] = [upcomingMeetups[0], upcomingMeetups[1]];
      return result;
    }
    catch(error)
    {
      console.log(error);
      throw error;
    }
  }
}
