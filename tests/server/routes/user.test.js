const chai = require('chai');
//const chaiHttp = require('chai-http');
const { expect } = chai;


//chai.use(chaiHttp);
let token;

describe('Users route', () => {
  const signup = '/users/signup/';
  const signin = '/users/signin';
  const user = {email: '123@gmail.com'}
});