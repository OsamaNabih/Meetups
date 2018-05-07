const MeetupModel = require('../models/meetup');
const Database = require('../config/DB');
const DBconfig = require('../config/keys').DBconfig;
module.exports = {
  GetAllMeetups: async (req, res) =>{
    try{
      const DB = new Database(DBconfig);
      let meetups = await DB.query(MeetupModel.GetAllMeetups());
      return meetups;
    }
    catch(error)
    {
      console.log(error);
      throw error;
    }
  }
}
