// will work for linux for windows we are going to user cross-env in package json
process.env.NODE_ENV = 'test';

const chai = require('chai');
const faker = require('faker');
const { expect } = chai;


const sql = require('./testingDatabaseSql');


const UserModel = require('../models/user');
const MeetupModel = require('../models/meetup');

const Database = require('../config/DB');
const DBconfig = require('../config/keys').DBconfig;
const DB = new Database(DBconfig);
const server = require('../app');


let token;

describe('Testing Models', () => {
  before(async () => {
        await DB.query(sql.sql)
  });


  it('Meetups are ordered successfuly by date', async function(){
    let options = await DB.query(MeetupModel.GetTwoMeetups())
    expect(options[0].meetupName).to.equal("helloworld1")
  });

  it('Attended user is succesfully returned', async function(){
    let options = await DB.query(MeetupModel.IsAttended(),[3,2])
    expect(options[0].userId).to.equal(3)
  });

  it('Option replies are successfully returned', async function(){
    let options = await DB.query(MeetupModel.CheckPreviousOptionsSubmission(),[1,1])
    expect(options[0].userId).to.equal(1);
  });

  it('Text replies are returned successfully', async function(){
    let options = await DB.query(MeetupModel.CheckPreviousRepliesSubmission(),[1,3])
    expect(options[0].userId).to.equal(3);
  });

  it('Meetup update is working', async function(){
    let data = {
      "meetupName": "Changing for the Test"
    }
    let options = await DB.query(MeetupModel.UpdateMeetup(),[data,1])
    let updated = await DB.query("SELECT meetupName FROM `meetups` where meetupId = 1")
    expect(updated[0].meetupName).to.equal("Changing for the Test");
  });

  
  it('Option replies are inserted successfully', async function(){
    let numberBefore = await DB.query("SELECT COUNT(userId) as replyCount FROM `FormOptionReplies` WHERE meetupId = 1 and questionId = 2")
    numberBefore = numberBefore[0].replyCount
    let data = {}
    data.meetupId = 1; data.questionId = 2; data.userId = 3; data.optionId = 2;
    let options = await DB.query(MeetupModel.InsertFormOptionReply(),data)
    let numberAfter = await DB.query("SELECT COUNT(userId) as replyCount FROM `FormOptionReplies` WHERE meetupId = 1 and questionId = 2")
    numberAfter = numberAfter[0].replyCount
    expect(numberAfter).to.be.above(numberBefore);
    
  });

  it('Text replies are inserted successfully', async function(){
    let numberBefore = await DB.query("SELECT COUNT(userId) as replyCount FROM `FormReplies` WHERE meetupId = 1 and questionId = 1")
    numberBefore = numberBefore[0].replyCount
    let data = {}
    data.meetupId = 1; data.questionId = 1; data.userId = 1; data.userReply = "Hopelessness is a curse";
    let options = await DB.query(MeetupModel.InsertFormReply(),data)
    let numberAfter = await DB.query("SELECT COUNT(userId) as replyCount FROM `FormReplies` WHERE meetupId = 1 and questionId = 1")
    numberAfter = numberAfter[0].replyCount
    expect(numberAfter).to.be.above(numberBefore);
    
  });

  it('Meetups are deleted successfully', async function(){
    let numberBefore = await DB.query("Select Count(meetupId) as meetupCount from Meetups")
    numberBefore = numberBefore[0].meetupCount
    let options = await DB.query(MeetupModel.DeleteMeetup(),1)
    let numberAfter = await DB.query("Select Count(meetupId) as meetupCount from Meetups")
    numberAfter = numberAfter[0].meetupCount
    expect(numberAfter).to.be.below(numberBefore);
  });

  it('Attendees are inserted successfully', async function(){
    let numberBefore = await DB.query("SELECT COUNT(*) as attendeeCount FROM `Attended`")
    numberBefore = numberBefore[0].attendeeCount
    let data = {}
    data.meetupId = 2; data.userId = 5; data.verified = 0;
    let options = await DB.query(MeetupModel.AddAttendee(),data)
    let numberAfter = await DB.query("SELECT COUNT(*) as attendeeCount FROM `Attended`")
    numberAfter = numberAfter[0].attendeeCount
    expect(numberAfter).to.be.above(numberBefore); 
  });

  

  // after all test have run we drop our test database
  after('droping test db', async () => {
    await DB.query("DELETE FROM `users`");
    await DB.query("DELETE FROM `meetups`");
    await DB.query("DELETE FROM `spoke_In`");
    await DB.query("DELETE FROM `attended`");
    await DB.query("DELETE FROM `images`");
    await DB.query("DELETE FROM `formquestions`")
    await DB.query("DELETE FROM `formoptions`")
    await DB.query("DELETE FROM `formreplies`")
    await DB.query("DELETE FROM `formoptionreplies`")
    
    DB.close()
    process.exit();
  });
});