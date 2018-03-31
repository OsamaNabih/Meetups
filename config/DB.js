const mysql = require('mysql');

const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'tafrah'
});

db.connect((err) =>{
  if(err){
      throw err;
  }
  console.log('Connected to MySQL DB');
});

module.exports = db;
