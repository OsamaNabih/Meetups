// will work for linux for windows we are going to user cross-env in package json
process.env.NODE_ENV = 'test';

const chai = require('chai');
const faker = require('faker');
const { expect } = chai;


const sql = require('../testingDatabaseSql');
const mainDirectory = '../../..';

const UserModel = require(mainDirectory + '/models/user');
const MeetupModel = require(mainDirectory + '/models/meetup');

const Database = require(mainDirectory + '/config/DB');
const DBconfig = require(mainDirectory + '/config/keys').DBconfig;
const DB = new Database(DBconfig);
const server = require(mainDirectory + '/app');

function comp(a, b){
  if (a.questionId != b.questionId) {
    return a.questionId - b.questionId;
  }
  return a.userId - b.userId;
}


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

  it('Should check previous options submissions, expecting (2, 1)', async function(){
    let result = await DB.query(MeetupModel.CheckPreviousFeedbackOptionsSubmission(), [1, 2]);
    expect(result[0].userId).to.be.equal(2);
    expect(result[0].meetupId).to.be.equal(1);
  });

   
  it('Should check previous options submissions, expecting empty array', async function(){
    let result = await DB.query(MeetupModel.CheckPreviousFeedbackOptionsSubmission(), [1, 50]);
    expect(result.length).to.be.equal(0);
  });

  it('Should return feedback replies, expecting one reply for userId 2', async function(){
    let result = await DB.query(MeetupModel.GetFeedBackReplies(), [4, 1]);
    expect(result.length).to.be.equal(1);
    expect(result[0].userId).to.be.equal(2);
    expect(result[0].userReply).to.be.equal("Next time get better speakers");
    expect(result[0].email).to.be.equal("user4@gmail.com");
    expect(result[0].firstName).to.be.equal("Very");
  });

  it('Should return feedback replies, expecting empty array for non feedback question', async function(){
    let result = await DB.query(MeetupModel.GetFeedBackReplies(), [1, 1]); //ID 1 is not a feedback question
    expect(result.length).to.be.equal(0);
  });

  it('Should return feedback replies, expecting empty array for no reply question', async function(){
    let result = await DB.query(MeetupModel.GetFeedBackReplies(), [5, 1]); //ID 5 has no replies
    expect(result.length).to.be.equal(0);
  });

  it("Should return all replies to a meetup's questions with options, expecting 3 replies", async function(){
    let result = await DB.query(MeetupModel.GetRegisteredChoiceReplies(), [1]);
    expect(result.length).to.be.equal(3);
    result.sort(comp);
    expect(result[0].userId).to.be.equal(1);
    expect(result[0].questionId).to.be.equal(2);
    expect(result[0].optionString).to.be.equal('that');
    expect(result[1].questionId).to.be.equal(2);
    expect(result[1].userId).to.be.equal(2);
    expect(result[1].firstName).to.be.equal('Very');
    expect(result[2].questionId).to.be.equal(3);
    expect(result[2].userId).to.be.equal(2);
  });

  it("Should return all replies to non-option questions, expecting 3 replies", async function(){
    let result = await DB.query(MeetupModel.GetRegisteredParagraphReplies(), [1]);
    expect(result.length).to.be.equal(3);
    result.sort(comp);
    expect(result[0].questionId).to.be.equal(1);
    expect(result[0].userId).to.be.equal(2);
    expect(result[0].optionString).to.be.equal('Nothing, i am hopeless');
    expect(result[1].questionId).to.be.equal(1);
    expect(result[1].userId).to.be.equal(3);
  });
  
  it("Should return feedback questions for a meetup, expecting 3 replies", async function(){
    let result = await DB.query(MeetupModel.GetFeedBackQuestionsOnly(), [1]);
    expect(result.length).to.be.equal(3);
    result.sort(function(a, b) {return a.questionId - b.questionId});
    expect(result[0].questionId).to.be.equal(3);
    expect(result[1].questionId).to.be.equal(4);
    expect(result[2].questionId).to.be.equal(5);
  });

  it("Should return feedback options for a certain question and meetup, expecting single reply", async function(){
    let result = await DB.query(MeetupModel.GetFeedBackOptions(), [1, 3, 1, 3]);
    expect(result.length).to.be.equal(1);
    expect(result[0].optionString).to.be.equal("Excellent");
    expect(result[0].optionId).to.be.equal(1);
  });

  /*
  it("Should return question IDs of feedback questions", async function(){
    let result = await DB.query(MeetupModel.GetNumberOfMultipleFeedbackQuestions());
    result.sort(function(a, b) {return a.questionId - b.questionId});
    expect(result[0].questionId).to.be.equal(2)
  });

  
  it("Should return number of feedback questions", async function(){
    let result = await DB.query(MeetupModel.GetNumberOfMultipleFeedbackQuestions(), [1]);
  });
  */

  it("Should return max question ID for a meetup, expecting 5", async function(){
    let result = await DB.query(MeetupModel.GetMaxIdOfQuestions(), [1]);
    expect(result[0].questionId).to.be.equal(5);
  });

  it("Should return max question ID for a meetup, expecting 0", async function(){
    let result = await DB.query(MeetupModel.GetMaxIdOfQuestions(), [2]);
    expect(result[0].questionId).to.be.null;
  });

  it('Meetup update is working', async function(){
    let data = {
      "meetupName": "Changing for the Test"
    }
    let options = await DB.query(MeetupModel.UpdateMeetup(),[data,1])
    let updated = await DB.query("SELECT meetupName FROM `meetups` where meetupId = 1")
    expect(updated[0].meetupName).to.equal("Changing for the Test");
  });

  it("Should invert verification status of attendees, expecting 0, 1", async function(){
    let result = await DB.query(MeetupModel.VerifyAttendees(), [2, [1, 3]]);
    let resultAfterQuery = await DB.query(MeetupModel.GetVerifiedAttendees(), [2]);
    ids = []
    resultAfterQuery.forEach(function(Attendee){
      ids.push(Attendee.userId);
    });
    expect(ids).to.have.members([1]);
    expect(ids).to.not.have.members([3]);
    await DB.query(MeetupModel.VerifyAttendees(), [2, [1, 3]]);
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
  });
});