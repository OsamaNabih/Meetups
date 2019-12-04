const chai = require('chai');
const faker = require('faker');
const { expect } = chai;
var sinon = require('sinon');
chai.use(require("chai-sorted"));
const rewire = require('rewire');
const sql = require('../testingDatabaseSql');
const mainDirectory = '../../..';

const UserModel = require(mainDirectory + '/models/user');
const MeetupModel = require(mainDirectory + '/models/meetup');

const Database = require(mainDirectory + '/config/DB');
const DBconfig = require(mainDirectory + '/config/keys').DBconfig;

const meetupsController = require(mainDirectory + '/controllers/meetups.js');
const meetupController = require(mainDirectory + '/controllers/meetup.js');
const userController = require(mainDirectory + '/controllers/users.js');
const mainPageController = require(mainDirectory + '/controllers/MainPage.js');
const server = require(mainDirectory + '/app');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised)

const DB = new Database(DBconfig);
describe('Testing Controllers', () => {
    /*
    it("Should succesfully insert user", async function(){
        let req = {}; req.value = {}; req.value.body = {};
        req.value.body.userId = 3; req.value.body.email = "om2@wagih.com"; req.value.body.authField = "Omar"; req.value.body.firstName = "Omar"; req.value.body.lastName = "Wagih";
        req.value.body.position = "The Law";
        let res = {};
        let options = await userController.signUp(req,res,async ()=>{ 
            expect(req).to.haveOwnProperty('token')
            const DB = new Database(DBconfig);
            let result = await DB.query('SELECT * FROM `users` WHERE `email` = "om2@wagih.com"');
            expect(result[0].email).to.equal("om2@wagih.com")
        })
    });
    */
    it("Token is sent back on sign in", async function(){
        let req = {}; req.user = []; req.user.push({});
        req.user[0].userId = 1; req.user[0].userType = 2; 
        let res = {};
        let options = await userController.signIn(req,res,async ()=>{});
        expect(req).to.haveOwnProperty('token')
    });

    it("Google Auth is sent back on sign in", async function(){
        let req = {}; req.user = {};
        req.user.userId = 1; req.user.userType = 2; 
        let res = {};
        res.cookie = function(string, token){
            this[string] = token;
        }
        res.redirect = function(string){
            this.url = string;
        }
        let options = await userController.googleOAuth(req,res,async ()=>{ });
        expect(res).to.haveOwnProperty('jwt');
        expect(res.url).to.be.equal("/");
    });

    it("Facebook Auth is sent back on sign in", async function(){
        let req = {}; req.user = {};
        req.user.userId = 1; req.user.userType = 2; 
        let res = {};
        res = {
            send: function(){ },
            json: function(err){
                this.token = err;
            },
            status: function(responseStatus) {
                this.response  = responseStatus;
                return this; 
            }
        }

        let options = await userController.facebookOAuth(req,res,async ()=>{ });
        expect(res).to.haveOwnProperty('token');
        expect(res.response).to.equal(200);
    });

    it("Gets User Info", async function(){
        let req = {}; req.params = {}; req.params.id = 3;
        let res = {};
        var stubDB = sinon.stub(userController,"getDataBase")
        .callsFake(function fakeFn(){ return {query: function(query,req){
            return [{email:"om2@wagih.com"}]
        },
        close: function() { return true;}
    }}); 
        let options = await userController.GetUserInfo(req,res);
        expect(options.email).to.equal("om2@wagih.com");
    });

    it("Gets Meetups Info", async function(){
        let req = {};
        let res = {};
        var stubDB = sinon.stub(meetupsController,"getDataBase")
        .callsFake(function fakeFn(){ return {query: function(query,req){
            return [{meetupId:1},{meetupId:2}]
        },
        close: function() { return true;}
    }}); 
        let options = await meetupsController.GetAllMeetups(req,res);
        //console.log(options[0])
        expect(options).length(2);
        expect(options[0].meetupId).to.be.oneOf([1, 2])
        expect(options[1].meetupId).to.be.oneOf([1, 2])
    });
    
    it("Gets Main Page Stats", async function() {
        let req = {}
        let res = {};
        var stubDB = sinon.stub(mainPageController,"getDataBase")
        .callsFake(function fakeFn(){ return {query: function(query){
            if(query === "Select Count(userId) as userCount from Users")
                return[{userCount:3}]
            else if (query === "Select Count(meetupId) meetupCount from Meetups")
                return [{meetupCount:5}]
            else if (query === "SELECT meetupName, slogan, meetupId FROM meetups ORDER BY meetupDate DESC")
                return [{mockedName:"helloworld1"},{mockedName:"helloworld2"}]
        }}});    
        let result = await mainPageController.GetMainPageStats(req,res)
        expect(result['numberOfUsers']).to.equal(3)
        expect(result['numberOfMeetups']).to.equal(5)
        expect(result['upcoming'][0].mockedName).to.equal("helloworld1")
        expect(result['upcoming'][1].mockedName).to.equal("helloworld2")
    });


    it("Gets Meetups And Speakers ",async function(){
        let req = {params:{id:'1'},user:{userId:'1'}}
        let res = {}
        var stubDB = sinon.stub(meetupController,"getDataBase")
        .callsFake(function fakeFn(){ return {query: function(query,params){
            if(query === "SELECT * FROM meetups WHERE meetupId = ?")
                    return new Promise((resolve,reject) => { resolve([{mockedMeetup:"meetup1"}])});
                else if(query === `SELECT userId, email, firstName, lastName, position FROM (spoke_in NATURAL JOIN meetups) JOIN users ON userId = speakerId WHERE meetupId = ?`)
                    return new Promise((resolve,reject) => {resolve([{mockedSpeakers:"speaker1"},{mockedSpeakers:"speaker2"}])});
                else if(query === `SELECT userId, email, firstName, lastName, position FROM (Attended NATURAL JOIN Meetups ) NATURAL JOIN Users WHERE meetupId = ? AND verified = true`)
                    return new Promise((resolve,reject) => {resolve([{mockedAttendees:"attendee1"},{mockedAttendees:"attendee2"}])});
                else if(query === "SELECT userId FROM Attended WHERE userId = ? AND meetupId = ? AND verified = true")
                     return new Promise((resolve,reject) => {resolve([{mockedUser:"user1"},{mockedUser:"user2"}])});
            },      
            close: function() { return new Promise((resolve,reject) =>{ resolve({done:"done"})})}
        }});
        let result = await meetupController.GetMeetupAndSpeakers(req,res);
        meetupController.getDataBase.restore();
        expect(result['meetup']['mockedMeetup']).to.equal("meetup1");
        expect(result['speakers'][0]['mockedSpeakers']).to.equal("speaker1");
        expect(result['speakers'][1]['mockedSpeakers']).to.equal("speaker2");
        expect(result['attendees'][0]['mockedAttendees']).to.equal("attendee1");
        expect(result['Registered']).to.equal(true)

    });

    it("Get Attendees", async function(){
        let req = {params:"id"};
        let res = {};
        var stubDB = sinon.stub(meetupController,"getDataBase")
        .callsFake(function fakeFn() { return {query: function(query,params){
            if(query === `SELECT userId, email, firstName, lastName, position, verified FROM (Attended NATURAL JOIN Meetups) NATURAL JOIN Users WHERE meetupId = ?`)
                return {mockedAttendees:"attendee1"}
            else 
                return {}; // just to return empty object if this test was accessed using a different query which should never happen.
        },
        close: function() { return 1}
    }});
    let result = await meetupController.GetAttendees(req,res)
    meetupController.getDataBase.restore();
    expect(result['mockedAttendees']).to.equal('attendee1')

    });

    it("Get Registered",async function(){
        let req = {params:{id:1}};
        let res = {};
        var stubDB = sinon.stub(meetupController,"getDataBase")
        .callsFake(function fakeFn() { return {query: function(query,params){
            if(query === `SELECT questionId,question, optionString,userId,firstName,lastName,email FROM FormOptionReplies NATURAL JOIN FormOptions NATURAL JOIN users NATURAL JOIN FormQuestions WHERE meetupId = ?`)
               return [{questionId:"2",question:"what are your hopes and dreams",optionString:"that",userId:"1",firstName:"Real",lastName:"Person",email:"user3@gmail.com"}
                    ,{questionId:"2",question:"what are your hopes and dreams",optionString:"this",userId:"2",firstName:"very",lastName:"Enthusiastic",email:"user4@gmail.com"}]

            else if(query === `SELECT questionId,question, userReply as optionString,userId,firstName,lastName,email FROM FormReplies NATURAL JOIN Users NATURAL JOIN FormQuestions WHERE meetupId = ?`)
                return [{questionId:"1",question:"what are your hopes and dreams",optionString:"Nothing, i am hopless",userId:"2",firstName:"very",lastName:"Enthusiastic",email:"user4@gmail.com"}
                        ,{questionId:"4",question:"Do you have any comments or suggestions",optionString:"Next time get better speakers",userId:"2",firstName:"very",lastName:"Enthusiastic",email:"user4@gmail.com"}]
        },
        close: function() { return 1}
     }})
     let result = await meetupController.GetRegistered(req,res)
     meetupController.getDataBase.restore();
     expect(result[0]['userId']).to.equal('1');
     expect(result[1]['userId']).to.equal('2');
     
    }); 
/*
    it("Create Meetup", async function(){
        let req = {};
        req.body =[];

        let exampleMeetup = {
            meetupName: "ExampleMeetup",
            slogan: "This is just an example",
            venue: "3ndy fel beet",
            capacity: 3,
            district: "Giza",
            ticketLink: "https://lickit.com",
            price: 123,
            startTime: "22:00:00",
            endTime: "22:01:00",
            meetupDate: "20191111",
            description: "YEEEET"
        }
        let EventInformation = {
            EventInformation: exampleMeetup,
            Questions: {}
        }
        req.body.EventInformation = EventInformation;
        let res = {};
        var stubDB = sinon.stub(meetupController,"getDataBase")
        .callsFake(function fakeFn() { return {query: function(query,params){
            if(query === "INSERT INTO Meetups SET ?")
                return {insertId:1}
            else if(query === "INSERT INTO FormQuestions SET ?")

            else if(query === "INSERT INTO FormOptions SET ?")
        },
        close: function() { return 1}
     }});
     let result = await meetupController.CreateMeetup(req,res)
     meetupController.getDataBase.restore();

    })
    
*/
    it("Gets Meetups Info", async function(){
        let req = {};
        let res = {};
        let options = await mainPageController.GetMainPageStats(req,res);
    });

    
    it("Should create feedback questions", async function(){
        let [req, res, questionTexts, questionTypes, required, meetupId, splitAnswers] = CreateFeedbackQuestionsSetUp();
        let stubDB = sinon.stub(meetupController,"getDataBase")
        stubDB.returns(
            { 
                query: function(query,params){
                    if(query === MeetupModel.GetFeedBackQuestionsOnly()) //returns question, questionId, questionType
                    {
                        return [];
                    }
                    else if(query === MeetupModel.GetMaxIdOfQuestions())
                        return [{questionId: 2}];
                    else if (query === MeetupModel.InsertQuestion())
                    {
                        let callNum = querySpy.withArgs(MeetupModel.InsertQuestion()).callCount;
                        let callIdx = callNum - 1;
                        expect(params.questionId).to.be.equal(2 + callNum);
                        expect(params.meetupId).to.be.equal(meetupId);
                        expect(params.questionType).to.be.equal(questionTypes[callIdx]);
                        expect(params.question).to.be.equal(questionTexts[callIdx]);
                        expect(params.required).to.be.equal(required[callIdx]);
                        return [];
                    }
                        
                    else if (query === MeetupModel.InsertOption())
                    {
                        //Question containing options is the last one
                        let questions = querySpy.withArgs(MeetupModel.InsertQuestion()).callCount;
                        let callNum = querySpy.withArgs(MeetupModel.InsertOption()).callCount;
                        let callIdx = callNum - 1;
                        expect(params.questionId).to.be.equal(2 + questions);
                        expect(params.optionId).to.be.equal(callNum);
                        expect(params.meetupId).to.be.equal(meetupId);
                        expect(params.optionString).to.be.equal(splitAnswers[callIdx]);
                        return [];
                    }
                        
                },
                close: function() {
                    return new Promise((resolve,reject) => {resolve(1)}); 
                }            
            }
        );
        let querySpy = sinon.spy(meetupController.getDataBase(), 'query'); //Spy on the getDatabase property called query
        try {
            let result = meetupController.CreateFeedbackQuestions(req, res);
            expect(querySpy.withArgs(MeetupModel.InsertQuestion()).callCount).to.be.equal(3, 'Number of questions should be 3');
            expect(querySpy.withArgs(MeetupModel.InsertOption()).callcount).to.be.equal(5, 'Number of options should be 5')
            meetupController.getDataBase.restore();
        } catch(err) {
            meetupController.getDataBase.restore();
        }
        //expect(querySpy.withArgs(MeetupModel.InsertQuestion()).callCount).to.be.equal(3, 'Number of questions should be 3');
        //expect(querySpy.withArgs(MeetupModel.InsertOption()).callcount).to.be.equal(5, 'Number of options should be 5')
        
    });
    
     
    it("Should create feedback questions, expecting to call res.send", async function(){       
        let [req, res, questionTexts, questionTypes, required, meetupId] = CreateFeedbackQuestionsSetUp();
        let stubDB = sinon.stub(meetupController,"getDataBase")
            .returns(CreateFeedbackQuestionsFailureStubDefinition());
        let resSendSpy = sinon.spy(res, 'send');
        try {
            await meetupController.CreateFeedbackQuestions(req,res); 
        } catch(err) {
            meetupController.getDataBase.restore();
            expect(resSendSpy.calledOnce).to.be.true;
            expect(err).to.be.equal('Already contains feedback Questions');
        }
        meetupController.getDataBase.restore();
        expect(resSendSpy.calledOnce).to.be.true;
    });
   
    it("Should return feedback questions and format them for the front-end", async function(){
        let [req, res, questionTexts, required, questionTypes, meetup, answers, questionIds, questions] = GetFeedBackQuestionsSetUp();
        let stubDB = sinon.stub(meetupController,"getDataBase")
            .returns(GetFeedBackQuestionsStubDefinition(questions, meetup, true));
        let result = await meetupController.GetFeedBackQuestions(req, res);
        meetupController.getDataBase.restore();
        let eventInfo = result.EventInformation;
        expect(eventInfo.meetupId).to.be.equal(meetup.meetupId);
        expect(eventInfo.description).to.be.equal(meetup.description);
        expect(eventInfo.capacity).to.be.equal(meetup.capacity);
        expect(eventInfo.meetupName).to.be.equal(meetup.meetupName);
        expect(eventInfo.price).to.be.equal(meetup.price);
        let returnedQuestions = result.Questions;
        expect(returnedQuestions.length).to.be.equal(questionIds.length);
        let i = 0;
        for(i = 0; i < 3; i++)
        {
            expect(returnedQuestions[i].question).to.be.equal(questionTexts[i]);
            expect(returnedQuestions[i].questionType).to.be.equal(questionTypes[i]);
            expect(returnedQuestions[i].required).to.be.equal(required[i]);
            expect(returnedQuestions[i].questionId).to.be.equal(i);
        }
        for(j = 0; j < answers.length; j++)
            expect(returnedQuestions[i - 1].Answers[j]).to.be.equal(answers[j]);
    });

    it("Should return feedback questions, expecting error to be thrown bec. meetup doesn't exist", async function(){
        let [req, res, questionTexts, required, questionTypes, meetup, answers, questionIds, questions] = GetFeedBackQuestionsSetUp();
        meetup = null;
        let stubDB = sinon.stub(meetupController,"getDataBase")
            .returns(GetFeedBackQuestionsStubDefinition(questions, meetup, false));
        try {
            let result = await meetupController.GetFeedBackQuestions(req, res);
            meetupController.getDataBase.restore();
        } catch(err) {
            meetupController.getDataBase.restore();
            expect(err).to.be.equal("No meetup exists with this Id");
        }
    });

    it("Should submit feedback form replies, expecting input data to be formatted for database", async function(){
        //Setup
        let [req, res, questionIds, optionIdOrUserReply, meetupId, userId] = SubmitFeedbackRepliesSetUp();
        //Mock/stub
        let stubDB = sinon.stub(meetupController,"getDataBase")
        stubDB.returns(
            { 
                query: function(query,params){
                    if(query === MeetupModel.CheckPreviousFeedbackSubmission()) 
                    {
                        return [];
                    }
                    else if(query === MeetupModel.CheckPreviousFeedbackOptionsSubmission())
                        return [];
                    else if (query === MeetupModel.InsertFormOptionReply())
                    {
                        expect(params.questionId).to.be.equal(questionIds[2]);
                        expect(params.meetupId).to.be.equal(meetupId);
                        expect(params.optionId).to.be.equal(optionIdOrUserReply[2] + 1);
                        expect(params.userId).to.be.equal(userId);
                        return [];
                    }
                        
                    else if (query === MeetupModel.InsertFormReply())
                    {
                        let callNum = querySpy.withArgs(MeetupModel.InsertFormReply()).callCount;
                        let callIdx = callNum - 1;
                        expect(params.questionId).to.be.equal(questionIds[callIdx]);
                        expect(params.meetupId).to.be.equal(meetupId);
                        expect(params.userReply).to.be.equal(optionIdOrUserReply[callIdx]);
                        expect(params.userId).to.be.equal(userId);
                        return [];
                    }
                },
                close: function() {
                    return new Promise((resolve,reject) => {resolve(1)}); 
                }            
            }
        );
        let querySpy = sinon.spy(meetupController.getDataBase(), 'query'); //Spy on the getDatabase property called query
        try {
            let result = await meetupController.SubmitFeedbackReplies(req, res);
            meetupController.getDataBase.restore(); 
        } catch(error) {
            meetupController.getDataBase.restore();
            throw error;
        }
        
    });


    it("Should submit feedback form replies, expecting error to be thrown due to previous feedback option reply", async function(){
        //Setup
        let [req, res, questionIds, optionIdOrUserReply, meetupId, userId] = SubmitFeedbackRepliesSetUp();
        //Mock/stub
        let stubDB = sinon.stub(meetupController,"getDataBase")
        stubDB.returns(
            { 
                query: function(query,params){
                    if(query === MeetupModel.CheckPreviousFeedbackSubmission()) 
                    {
                        return [];
                    }
                    else if(query === MeetupModel.CheckPreviousFeedbackOptionsSubmission())
                        return [{userId: 4, meetupId: 5}];
                    else if (query === MeetupModel.InsertFormOptionReply())
                        return [];
                    else if (query === MeetupModel.InsertFormReply())
                        return [];
                },
                close: function() {
                    return new Promise((resolve,reject) => {resolve(1)}); 
                }            
            }
        );
        let querySpy = sinon.spy(meetupController.getDataBase(), 'query'); //Spy on the getDatabase property called query
        try {
            let result = await meetupController.SubmitFeedbackReplies(req, res);
            meetupController.getDataBase.restore();
        } catch(error) {
            meetupController.getDataBase.restore();
            expect(error).to.be.equal('You have already inserted a feedback for this meetup');
        }
    })

    it("Should submit feedback form replies, expecting error to be thrown due to previous feedback reply", async function(){
        //Setup
        let [req, res, questionIds, optionIdOrUserReply, meetupId, userId] = SubmitFeedbackRepliesSetUp();
        //Mock/stub
        let stubDB = sinon.stub(meetupController,"getDataBase")
        stubDB.returns(
            { 
                query: function(query,params){
                    if(query === MeetupModel.CheckPreviousFeedbackSubmission()) 
                    {
                        return [{userId: 4, meetupId: 5}];
                    }
                    else if(query === MeetupModel.CheckPreviousFeedbackOptionsSubmission())
                        return [];
                    else if (query === MeetupModel.InsertFormOptionReply())
                        return [];
                    else if (query === MeetupModel.InsertFormReply())
                        return [];
                },
                close: function() {
                    return new Promise((resolve,reject) => {resolve(1)}); 
                }            
            }
        );
        let querySpy = sinon.spy(meetupController.getDataBase(), 'query'); //Spy on the getDatabase property called query
        try {
            let result = await meetupController.SubmitFeedbackReplies(req, res);
            meetupController.getDataBase.restore();
        } catch(error) {
            meetupController.getDataBase.restore();
            expect(error).to.be.equal('You have already inserted a feedback for this meetup');
        }
    })

    it("Should", async function(){
        
    })

    function CreateFeedbackQuestionsSetUp() {
        let res = {send: function(s){ return s;}};
        let questionTexts = ["How was the session?", "Do you have any suggestions?", "Rate the session"];
        let questionTypes = [1, 1, 2];
        let required = [true, false, true];
        let meetupId = 5;
        let questions = [];
        let answers = 'Excellent|Very good|Okay|Bad|Terrible'
        for(let i = 0; i < 3; i++){
            questions.push({question: questionTexts[i], 
                              questionType: questionTypes[i], 
                              required: required[i],
                              meetupId: meetupId})
        }
        questions[2]['Answers'] = answers;
        let splitAnswers = answers.split('|');
        let req = {body: 
                        {id: meetupId, 
                         Questions: questions}
                    };
        return [req, res, questionTexts, questionTypes, required, meetupId, splitAnswers];
    }


    function CreateFeedbackQuestionsFailureStubDefinition() {
        return {query: function(query,params){
            if(query === MeetupModel.GetFeedBackQuestionsOnly()) //returns question, questionId, questionType
                return [{question: "Would you attend another meeting?", questionId: "3", questionType: 1}]
            else if(query === MeetupModel.GetMaxIdOfQuestions())
                return [];
            else 
                return [];
            },
            close: function() {
                return new Promise((resolve,reject) => {resolve(1)}); 
            }
        };
    }

    function GetFeedBackQuestionsSetUp() {
        let req = {params: {id: 1}};
        let res = {};
        let questions = []
        let questionTexts = ["How was the session?", "Do you have any suggestions?", "Rate the session"];
        let questionTypes = [1, 1, 2];
        let questionIds = [1, 2, 3];
        let required = [true, false, true];
        let meetupId = 5;
        let answers = ['Excellent', 'Very good', 'Okay', 'Bad', 'Terrible']
        for(let i = 0; i < 2; i++){
            questions.push({question: questionTexts[i], 
                              questionType: questionTypes[i], 
                              required: required[i],
                              meetupId: meetupId,
                              questionId: i})
        }
        for(let j = 0; j < answers.length; j++)
        {
            questions.push({question: questionTexts[2],
                            questionType: questionTypes[2],
                            required: required[2],
                            MAX: answers.length,
                            optionString: answers[j],
                            meetupId: meetupId,
                            questionId: 2})
        }
        let meetup = {meetupId: meetupId, meetupName: "name", capacity: 5, description: "description", price: 5};
        return [req, res, questionTexts, required, questionTypes, meetup, answers, questionIds, questions];
    }

    function GetFeedBackQuestionsStubDefinition(questions, meetup, success){
        return {query: function(query,params){
            if(query === MeetupModel.GetMeetup() && success) //returns question, questionId, questionType
                return [meetup];
            else if(query === MeetupModel.GetQuestions())
                return questions;
            else 
                return [];
            },
            close: function() {
                return new Promise((resolve,reject) => {resolve(1)}); 
            }
        };
    }

    function SubmitFeedbackRepliesSetUp() {
        let questions = []
        let questionTypes = [1, 1, 2];
        let questionIds = [1, 2, 3];
        let meetupId = 5;
        let optionIdOrUserReply = ["It was great", "None that I can think of", 3];
        let userId = 3;
        for (let i = 0; i < 3; i++) {
            questions.push({questionId: questionIds[i],
                            questionType: questionTypes[i],
                            Answer: optionIdOrUserReply[i]});
        }
        let req = {body:
                {userId: userId,
                meetupId: meetupId,
                Questions: questions
                }
            };
        let res = {};
        return [req, res, questionIds, optionIdOrUserReply, meetupId, userId];
    }
});