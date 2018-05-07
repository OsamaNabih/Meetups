const MeetupModel = require('../models/meetup');
const Database = require('../config/DB');
const DBconfig = require('../config/keys').DBconfig;
module.exports = {
  GetMainPageStats: async (req, res) =>{
    try{
      const DB = new Database(DBconfig);
      let numberOfUsers = await DB.query(MeetupModel.GetCountOfAllUsers());
      let numberOfMeetups = await DB.query(MeetupModel.GetCountOfALLMeetups());
      let result = {};
      result['numberOfUsers'] = numberOfUsers[0].userCount;
      result['numberOfMeetups'] = numberOfMeetups[0].meetupCount;
      return result;
    }
    catch(error)
    {
      console.log(error);
      throw error;
    }
  }
}
