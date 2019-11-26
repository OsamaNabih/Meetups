const MeetupModel = require('../models/meetup');
const Database = require('../config/DB');
const DBconfig = require('../config/keys').DBconfig;
module.exports = {
  getDataBase: function (DBconfig){
    var db = new Database(DBconfig)
    return db
  },
  GetAllMeetups: async (req, res) =>{
    try{
      const DB = await module.exports.getDataBase(DBconfig);
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
