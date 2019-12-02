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
const user = {email: '122223@gmail.com', firstName: "Omar", lastName: "Wagih",
authField:"Nothing",position: "The law", birthDate: "20191111" }

describe('Users route', () => {
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
    await DB.query(`Insert Into Users(userId,email,firstName,lastName,authField,authType,userType,birthDate,position, imagePath)
    Values(2,"user4@gmail.com", "Very", "Enthusiastic", "2222",1, 2, 19900413, "Machine Learning Engineer", "Images/default-avatar.png")`)

    DB.close()
  });

  it("Should test the signup POST", () => {
    chai.request(server)
    .post(signup)
    .redirects(0)
    .send(user)
    .end((err, res) => {
          expect(res.status).to.equal(302);
          expect(res.headers).to.haveOwnProperty("set-cookie")
    });
  })

  it("Should test the signup GET", () => {
    chai.request(server)
    .get(signup)
    .redirects(0)
    .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.text.search("Tafrah - Sign up")).to.not.equal(-1);  
    });
  })
  it("Should test the signin POST", () => {
    var userSignin = {email:user.email,authField:user.authField}
    chai.request(server)
    .post(signin)
    .redirects(0)
    .send(userSignin)
    .end((err, res) => {
      expect(res.status).to.equal(200);
      expect(res.body).to.haveOwnProperty("token")
    });
  })

  it("Should test the signin GET", () => {
    chai.request(server)
    .get(signin)
    .redirects(0)
    .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.text.search("Tafrah - Sign in")).to.not.equal(-1);  
    });
  })
  it("Should test the get user", () => {
    chai.request(server)
    .get('/users/2')
    .redirects(0)
    .end((err, res) => {
          expect(res.text.search("First Name")).to.not.equal(-1);
          expect(res.status)
    });
  })

  it("Should test that facebook authentication returns a token", () => {
    var userSignin = {email:user.email,authField:user.authField}
    chai.request(server)
    .post("/users/oauth/facebook")
    .redirects(0)
    .send(userSignin)
    .end((err, res) => {
      expect(res.status).to.equal(200);
    })
  })

  it("Should test the editProfile POST", () => {
    var userSignin = {email:user.email,authField:user.authField}
    chai.request(server)
    .post("/users/editProfile")
    .redirects(0)
    .send(userSignin)
    .end((err, res) => {
      expect(res.status).to.equal(200);
    });
  })

  it("Should test the editProfile GET", () => {
    chai.request(server)
    .get("/user/editProfile")
    .redirects(0)
    .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.text.search("Register")).to.not.equal(-1);  
    });
  })
  
});

