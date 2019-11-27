// will work for linux for windows we are going to user cross-env in package json
process.env.NODE_ENV = 'test';

const chai = require('chai');
const faker = require('faker');
const { expect } = chai;
chai.use(require("chai-sorted"));

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

  // Bassel tests start

  it('Get Speakers Id Working', async function (){
    let result = await DB.query(MeetupModel.GetSpeakersId(), [2]);
    expect(result[0].speakerId).to.be.equal(3);    
    expect(result.length).to.be.equal(1);     
  });

  it('Get Meet up Working', async function (){
    let result = await DB.query(MeetupModel.GetMeetup(), [1]);
    expect(result[0].meetupName).to.be.equal('helloworld1');  
    expect(result.length).to.be.equal(1);      
  });  

  it('Get Speakers Working', async function (){
    let result = await DB.query(MeetupModel.GetSpeakers(), [2]);
    expect(result[0].userId).to.be.equal(3);
    expect(result[0].email).to.be.equal('user5@gmail.com');
    expect(result[0].firstName).to.be.equal('Techie');
    expect(result[0].lastName).to.be.equal('Goals');
    expect(result[0].position).to.be.equal('Senior Machine Learning Engineer');
    expect(result.length).to.be.equal(1);      
  });

  it('Get Attendees Working', async function (){
    let result = await DB.query(MeetupModel.GetAttendees(), [1]);
    expect(result.length).to.be.equal(1); 
    expect(result[0].userId).to.be.equal(2);
    expect(result[0].email).to.be.equal('user4@gmail.com');
    expect(result[0].firstName).to.be.equal('Very');
    expect(result[0].lastName).to.be.equal('Enthusiastic');
    expect(result[0].position).to.be.equal('Machine Learning Engineer');
    expect(result[0].verified).to.be.equal(1);
  });

  it('Get Verified Attendees Working', async function (){
    let result = await DB.query(MeetupModel.GetVerifiedAttendees(), [2]);
    expect(result.length).to.be.equal(1); 
    expect(result[0].userId).to.be.equal(3);
    expect(result[0].email).to.be.equal('user5@gmail.com');
    expect(result[0].firstName).to.be.equal('Techie');
    expect(result[0].lastName).to.be.equal('Goals');
    expect(result[0].position).to.be.equal('Senior Machine Learning Engineer');
  });

  it('Get Questions with options working', async function (){
    let result = await DB.query(MeetupModel.GetQuestions(), [1, 1, 0]);
    expect(result.length).to.be.equal(3);
    expect(result[0].question).to.be.equal('What are your hopes and dreams?');
    expect(result[0].required).to.be.equal(1);
    expect(result[0].meetupId).to.be.equal(1);
    expect(result[0].questionId).to.be.equal(1);
    expect(result[0].MAX).to.be.equal(null);
    expect(result[0].optionString).to.be.equal(null);
    expect(result[0].questionType).to.be.equal(0);
  });
  
  it('Check Previous Feedback Submission working', async function (){
    let result = await DB.query(MeetupModel.CheckPreviousFeedbackSubmission(), [1, 2]);
    expect(result.length).to.be.equal(1);
    //on join only {meetupId,questionId = 1,4} will join
    expect(result[0].userId).to.be.equal(2);
    expect(result[0].meetupId).to.be.equal(1);
  });
  
  // Bassel tests end 

  it('Get userId by email', async function(){
    let email = "user3@gmail.com"
    let options = await DB.query(UserModel.GetUserId(),email)
    expect(options[0].userId).to.equal(1)
  
  });

  // Walid starts
  it('Get userId and type by email',async function(){
    let email = "user3@gmail.com"
    let options = await DB.query(UserModel.GetUserIdAndTypeByEmail(),email)
    expect(options[0].userId).to.equal(1)
    expect(options[0].userType).to.equal(2)
  });

  it('Get userId and type by Id',async function(){
    let ID = 1
    let options = await DB.query(UserModel.GetUserIdAndTypeById(),ID)
    expect(options[0].userId).to.equal(1)
    expect(options[0].userType).to.equal(2)
  });

  it('Get user by email',async function(){
    let email = "user3@gmail.com"
    let options = await DB.query(UserModel.GetUser(),email)
    expect(options[0].userId).to.equal(1)    
    expect(options[0].email).to.equal("user3@gmail.com")
    expect(options[0].firstName).to.equal('Real')
    expect(options[0].lastName).to.equal('Person')
    expect(options[0].authField).to.equal('1111')
    expect(options[0].authType).to.equal(1)
    expect(options[0].userType).to.equal(2)
    //expect(options[0].birthDate).to.equal(`Fri, 01 Jun 1990 22:00:00 GMT`)
    expect(options[0].position).to.equal("Junior back-end developer")
    expect(options[0].imagePath).to.equal("Images/default-avatar.png")  
  });

  it('Get user by Id',async function(){
    let ID = 1
    let options = await DB.query(UserModel.GetUserById(),ID)
    expect(options[0].userId).to.equal(1)
    expect(options[0].email).to.equal("user3@gmail.com")
    expect(options[0].firstName).to.equal('Real')
    expect(options[0].lastName).to.equal('Person')
    expect(options[0].authField).to.equal('1111')
    expect(options[0].authType).to.equal(1)
    expect(options[0].userType).to.equal(2)
    //expect(options[0].birthDate).to.equal(`Fri, 01 Jun 1990 22:00:00 GMT`)
    expect(options[0].position).to.equal("Junior back-end developer")
    expect(options[0].imagePath).to.equal("Images/default-avatar.png")  
  });

  it('Get user name and email by Id',async function(){
    let ID = 1
    let options = await DB.query(UserModel.GetUserNameAndEmailById(),ID)
    expect(options[0].firstName).to.equal("Real")
    expect(options[0].lastName).to.equal("Person")
    expect(options[0].email).to.equal("user3@gmail.com")
  });

  it('Get meetups ordered by date in descending order',async function(){
    let ID = 1
    let options = await DB.query(MeetupModel.GetAllMeetups(),ID)
    expect(options).to.be.sortedBy("meetupDate",{descending:true});
  });

  it('Get count of all users',async function(){
    let options = await DB.query(MeetupModel.GetCountOfAllUsers())
    expect(options[0].userCount).to.equal(5)
  });

  it('Get count of all meetups',async function(){
    let options = await DB.query(MeetupModel.GetCountOfALLMeetups())
    expect(options[0].meetupCount).to.equal(2)
  });

<<<<<<< HEAD
  //Bassel
  it('Meetups are inserted successfully', async function(){
    let numberBefore = await DB.query("SELECT COUNT(meetupId) as replyCount FROM `Meetups` WHERE meetupName = 'helloworld1'")
    numberBefore = numberBefore[0].replyCount
    let data = {}
    data.meetupName = "helloworld1"; data.capacity = 500; data.description = "Why should I care ?";  data.price = 100;
    let options = await DB.query(MeetupModel.InsertMeetup(),data)
    let numberAfter = await DB.query("SELECT COUNT(meetupId) as replyCount FROM `Meetups` WHERE meetupName = 'helloworld1'")
    numberAfter = numberAfter[0].replyCount
    expect(numberAfter).to.be.above(numberBefore);
  });
  
  it('Options are inserted successfully', async function(){
    let numberBefore = await DB.query("SELECT COUNT(meetupId) as replyCount FROM `FormOptions` WHERE optionId = 1")
    numberBefore = numberBefore[0].replyCount
    let data = {}
    data.meetupId = 1; data.optionId = 1; data.questionId = 4; data.optionString = "VERY BAD";
    let options = await DB.query(MeetupModel.InsertOption(),data)
    let numberAfter = await DB.query("SELECT COUNT(meetupId) as replyCount FROM `FormOptions` WHERE optionId = 1")
    numberAfter = numberAfter[0].replyCount
    expect(numberAfter).to.be.above(numberBefore);
  });
=======
  // Walid Ends, Wagih Starts
>>>>>>> c553ee4b7a20b47a89c808f487abc54ea4721365

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

  // Wagih Ends, Osama Starts
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


  it("Should return question IDs of feedback questions", async function(){
    let result = await DB.query(MeetupModel.GetNumberOfMultipleFeedbackQuestions());
    result.sort(function(a, b) {return a.questionId - b.questionId});
    expect(result[0].questionId).to.be.equal(2)
  });

  
  it("Should return number of feedback questions with options, expecting 3", async function(){
    let result = await DB.query(MeetupModel.GetNumberOfMultipleFeedbackQuestions(), [1]);
    expect(result[0]).to.be.equal(3);
  });

  it("Should return option IDs of feedback replies, expecting 1 value of 1", async function(){
    let result = await DB.query(MeetupModel.GetFeedBackOption(), [1, 3]);
    expect(result[0]).to.be.equal(1);
    expect(result.length).to.be.equal(1);
  });
  

  it("Should return max question ID for a meetup, expecting 5", async function(){
    let result = await DB.query(MeetupModel.GetMaxIdOfQuestions(), [1]);
    expect(result[0].questionId).to.be.equal(5);
  });

  it("Should return max question ID for a meetup, expecting 0", async function(){
    let result = await DB.query(MeetupModel.GetMaxIdOfQuestions(), [2]);
    expect(result[0].questionId).to.be.null;
  });

  // Osama End, Updating inserting and deleting starts

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
    let data = {}
    data.meetupId = 1; data.questionId = 2; data.userId = 3; data.optionId = 2;
    let options = await DB.query(MeetupModel.InsertFormOptionReply(),data)
    expect(options.affectedRows).to.equal(1)
  });

  it('Text replies are inserted successfully', async function(){
    let data = {}
    data.meetupId = 1; data.questionId = 1; data.userId = 1; data.userReply = "Hopelessness is a curse";
    let options = await DB.query(MeetupModel.InsertFormReply(),data)
    expect(options.affectedRows).to.equal(1)
    
  });

  it('Question are inserted successfully', async function(){
    let numberBefore = await DB.query("SELECT COUNT(meetupId) as replyCount FROM `FormQuestions` WHERE required = 1")
    numberBefore = numberBefore[0].replyCount
    let data = {}
    data.meetupId = 1; data.question = "Would it make any difference ?"; data.questionId = 6; data.required = 1;
    let options = await DB.query(MeetupModel.InsertQuestion(),data)
    let numberAfter = await DB.query("SELECT COUNT(meetupId) as replyCount FROM `FormQuestions` WHERE required = 1")
    numberAfter = numberAfter[0].replyCount
    expect(numberAfter).to.be.above(numberBefore);
  });

  it('Meetups are deleted successfully', async function(){
    let options = await DB.query(MeetupModel.DeleteMeetup(),1)
    expect(options.affectedRows).to.equal(1)
  });

  it('Attendees are inserted successfully', async function(){
    let data = {}
    data.meetupId = 2; data.userId = 5; data.verified = 0;
    let options = await DB.query(MeetupModel.AddAttendee(),data)
    expect(options.affectedRows).to.equal(1)
  });

  it('Insert User', async function (){
    let user = {
			email:"waleedemail1@gmail.com",
			firstName:"Waleed",
			lastName:"Ashraf",
			userType:"1",
			authField:3,
			authType:3,
			birthDate:"2018-09-04",
			imagePath:"Images/default-avatar.png",
			position:"Professional Procrastinator",
			aboutme:null,
      }
      let options = await DB.query(UserModel.InsertUser(),user)
      expect(options.affectedRows).to.equal(1)
  });
 
<<<<<<< HEAD

  
=======
>>>>>>> c553ee4b7a20b47a89c808f487abc54ea4721365
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