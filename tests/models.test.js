// will work for linux for windows we are going to user cross-env in package json
process.env.NODE_ENV = 'test';

const chai = require('chai');
//const faker = require('faker');
//const { expect } = chai;


const sql = require('./testingDatabaseSql');


const UserModel = require('../models/user');
//const MeetupModel = require('../models/meetup');

const Database = require('../config/DB');
const DBconfig = require('../config/keys').DBconfig;
const DB = new Database(DBconfig);
//const server = require('../app');


let token;

//console.log(sql.sql)
describe('Testing Models', () => {
	before(async () => {
		DB.query(sql.sql)
	});


  /*
  it('should return true', async () => {
    return true
  });
  */
  	describe('Insert User', () => {
		const user = {
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

		it('Returns The User', async (done) => {
			DB.query(UserModel.InsertUser(),user).then(result => {
			console.log("this is the result",result)
			if(err){
				done(err);
				return;
			}
			expect(result).to.equal("25")
			done();
			}).catch( err => {
				done(err);
			}); 
		});

	}); 

  // after all test have run we drop our test database
	after('droping test db', async () => {
		console.log("Whatsup")
		DB.query("DELETE FROM users");
		DB.query("DELETE FROM meetups");
		DB.query("DELETE FROM spoke_In");
		DB.query("DELETE FROM attended");
		DB.query("DELETE FROM images");
		DB.query("DELETE FROM formquestions")
		DB.query("DELETE FROM formoptions")
		DB.query("DELETE FROM formreplies")
		DB.query("DELETE FROM formoptionreplies")
		DB.close()
		process.exit();
	})
});


