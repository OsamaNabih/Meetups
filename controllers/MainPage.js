const MeetupModel = require('../models/meetup');
const Database = require('../config/DB');
const DBconfig = require('../config/keys').DBconfig;

module.exports = {

  // Walid starts
  
  getDataBase: function (DBconfig){
    var db = new Database(DBconfig)
    return db
  },
  GetMainPageStats: async (req, res) =>{
    try{
      const DB = await module.exports.getDataBase(DBconfig);
      let numberOfUsers = await DB.query(MeetupModel.GetCountOfAllUsers());
      let numberOfMeetups = await DB.query(MeetupModel.GetCountOfALLMeetups());
      let upcomingMeetups = await DB.query(MeetupModel.GetTwoMeetups());
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
