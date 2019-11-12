const chai = require('chai');
const faker = require('faker');
const { expect } = chai;
var sinon = require('sinon');
chai.use(require("chai-sorted"));

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

const DB = new Database(DBconfig);
describe('Testing Controllers', () => {
    before('droping test db', async () => {
        DB.query(`Insert Into Meetups(meetupId,meetupName,capacity,description,price,venue,meetupDate,slogan,district, ticketLink)
        values (1,"helloworld1",50000,"how to procrastinate",0,"my house ",STR_TO_DATE('01-10-2018','%m-%d-%Y'),"Procrastinate FTW","Dokki", "https://paymestore.co/085617");
        
        Insert Into Meetups(meetupId,meetupName,capacity,description,price,venue,meetupDate,slogan,district, ticketLink)
        values (2,"helloworld2",4165000,"how to procrastinate",33,"my house ",STR_TO_DATE('01-09-2018','%m-%d-%Y'),"Procrastinate FTW","Dokki", "https://paymestore.co/085617");
    `)
});


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
        let options = await userController.GetUserInfo(req,res);
        expect(options.email).to.equal("om2@wagih.com");
    });

    it("Gets Meetups Info", async function(){
        let req = {};
        let res = {};
        let options = await meetupsController.GetAllMeetups(req,res);
        expect(options).length(2);
        expect(options[0].meetupId).to.be.oneOf([1, 2])
        expect(options[1].meetupId).to.be.oneOf([1, 2])
    });

    after('closing database', async () => {
        await DB.query("DELETE FROM `users`");
        await DB.query("DELETE FROM `meetups`");
        await DB.query("DELETE FROM `spoke_In`");
        await DB.query("DELETE FROM `attended`");
        await DB.query("DELETE FROM `images`");
        await DB.query("DELETE FROM `formquestions`")
        await DB.query("DELETE FROM `formoptions`")
        await DB.query("DELETE FROM `formreplies`")
        await DB.query("DELETE FROM `formoptionreplies`")
        DB.close();
    })

});