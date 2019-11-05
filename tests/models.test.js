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

  it('should check if previous option replies are returned successfully', async function(){
    let options = await DB.query(MeetupModel.CheckPreviousOptionsSubmission(),[1,1])
    expect(options[0].userId).to.equal(1);
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