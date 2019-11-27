const chai = require('chai');
//const chaiHttp = require('chai-http');
const { expect } = chai;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const mainDirectory = '../../..';
const server = require(mainDirectory + '/app');
const Database = require(mainDirectory + '/config/DB');
const DBconfig = require(mainDirectory + '/config/keys').DBconfig;
const DB = new Database(DBconfig);

//chai.use(chaiHttp);
let token;
const signup = '/users/signup/';
const signin = '/users/signin';

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
var userSignin = {email:"admin@gmail.com",authField:"1234567"}
   async function s() {
     var res = await chai.request(server)
    .post("/users/signin")
    .redirects(0)
    .send(userSignin)
    token = res.body.token
   }
   s();

describe('Meetup route',  () => {
  before('droping test db', async () => {
    await DB.query("DELETE FROM `users`");
    await DB.query("DELETE FROM `meetups`");
    await DB.query("DELETE FROM `spoke_In`");
    await DB.query("DELETE FROM `attended`");
    await DB.query("DELETE FROM `images`");
    await DB.query("DELETE FROM `formquestions`")
    await DB.query("DELETE FROM `formoptions`")
    await DB.query("DELETE FROM `formreplies`")
    await DB.query("DELETE FROM `formoptionreplies`")
    await DB.query(`Insert Into Meetups(meetupId,meetupName,capacity,description,price,venue,meetupDate,slogan,district, ticketLink)
    values (1,"helloworld1",50000,"how to procrastinate",0,"my house ",STR_TO_DATE('01-10-2018','%m-%d-%Y'),"Procrastinate FTW","Dokki", "https://paymestore.co/085617");
    
    Insert Into Users(userId,email,firstName,lastName,authField,authType,userType,birthDate,position, imagePath)
    Values(1,"admin@gmail.com", "Test", "Admin", "$2a$10$QVdyel36wruTSd7N851ff.JDz4u8hlEklpJUvIHoiuIvmJIDlVhEa",1, 1, 19900413, "The admin", "Images/default-avatar.png");

    Insert Into Meetups(meetupId,meetupName,capacity,description,price,venue,meetupDate,slogan,district, ticketLink)
    values (2,"helloworld2",4165000,"how to procrastinate",33,"my house ",STR_TO_DATE('01-09-2018','%m-%d-%Y'),"Procrastinate FTW","Dokki", "https://paymestore.co/085617");
`)
    DB.close()
  });
  it("Should test the create meetup get",async () => {
    const res = await chai.request(server)
    .get("/meetup/create")
    .redirects(0)
    .set('Cookie', 'jwt='+token)
    expect(res.status).to.equal(200);
    expect(res.text.search("Tafrah - Add Meetup")).to.not.equal(-1);
  })
  it("Should test the create meetup post", async () => {
    let EventInformation = {
        EventInformation: exampleMeetup,
        Questions: {}
    }
    const res = await chai.request(server)
    .post("/meetup/create")
    .redirects(0)
    .send(EventInformation)
    .set('Cookie', 'jwt='+token)
    expect(res.status).to.equal(200);
    expect(JSON.parse(res.text).message).to.equal("Meetup has been created successfully");
    expect(JSON.parse(res.text).meetupId).to.be.a('number')
    
  })

  it("Should test the register meetup get", async () => {
    const res = await chai.request(server)
    .get("/meetup/2/register")
    .redirects(0)
    .set('Cookie', 'jwt='+token)
    expect(res.status).to.equal(200);
    expect(res.text.search("Tafrah - Form")).to.not.equal(-1);  
  })
  
  it("Should test the register meetup post", async () => {
    let verifiedUsers ={
      Questions: {},
      meetupId:2
    }
    const res = await chai.request(server)
    .post("/meetup/2/register")
    .redirects(0)
    .send(verifiedUsers)
    .set('Cookie', 'jwt='+token)
    expect(res.status).to.equal(200);
    expect(res.body).to.equal("Your registration has been completed successfully")
  })

  it("Should test the validate meetup get", async () => {
    const res = await chai.request(server)
    .get("/meetup/2/validate")
    .redirects(0)
    .set('Cookie', 'jwt='+token)
    expect(res.status).to.equal(200);
    expect(res.text.search("Tafrah - Validate Users")).to.not.equal(-1);
  
  })
  
  it("Should test the validate meetup post", async () => {
    let verifiedUsers ={
      verifiedUsers: [{userId:1}],
      meetupId:2
    }
    const res = await chai.request(server)
    .post("/meetup/2/validate")
    .redirects(0)
    .send(verifiedUsers)
    .set('Cookie', 'jwt='+token)
    expect(res.status).to.equal(200);
    expect(res.body).to.equal("Attendees updated")
  })

  it("Should test the add feedback get", async () => {
    const res = await chai.request(server)
    .get("/meetup/2/addFeedback")
    .redirects(0)
    .set('Cookie', 'jwt='+token)
    expect(res.status).to.equal(200);
    expect(res.text.search("Add your feedback form!")).to.not.equal(-1); 
  })
  
  it("Should test the add feedback post", async () => {
    let verifiedUsers ={
      id:2,
      Questions: [{
        question: "What are your thoughts and dreams?",
        questionType:1,
        meetupId:2,
        required:1
      }]
    }
    const res = await chai.request(server)
    .post("/meetup/2/addFeedback")
    .redirects(0)
    .send(verifiedUsers)
    .set('Cookie', 'jwt='+token)
    expect(res.status).to.equal(200);
  })
  
});

