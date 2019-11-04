// will work for linux for windows we are going to user cross-env in package json
process.env.NODE_ENV = 'test';

const chai = require('chai');
const faker = require('faker');
const { expect } = chai;

const UserModel = require('../models/user');
const MeetupModel = require('../models/meetup');

const Database = require('../config/DB');
const DBconfig = require('../config/keys').DBconfig;
const DB = new Database(DBconfig);
const server = require('../app');


let token;

console.log("here")

function createABunchOfFakes()
{
    var users = []
    for(var i = 0;i<5;i++){
        users.push({
            email: faker.internet.email(),
            firstName: faker.name.findName().split(" ")[0],
            lastName: faker.name.findName().split(" ")[0],
            authField: faker.internet.password(),
            authType: 1,
            userType: 3,
            birthDate: 19900413,
            position: faker.name.jobTitle(),
            imagePath: "Images/default-avatar.png"
        });
    }
    return users
}

describe('Testing Models', () => {
  const users = createABunchOfFakes()

  before(async () => {
      console.log("DB")
    for(var i = 0;i < 5;i++)
    {
        DB.query(UserModel.InsertUser(), users[i])
    }

  });

  it('should return true', async () => {
    return true
  });

  // after all test have run we drop our test database
  after('droping test db', async () => {
    
    DB.query("DELETE FROM Users");
    DB.query("DELETE FROM Meetups");
    DB.query("DELETE FROM Spoke_In");
    DB.query("DELETE FROM Attended");
    DB.query("DELETE FROM Images");
    DB.close()

    process.exit();
  })
});