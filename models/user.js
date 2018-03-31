
module.exports = {
  InsertUser:  function(){
    return "Insert Into Users set ?";
  },
  GetUserId: function(){
    return "Select userId from Users where email = ?";
  },
  GetUser: function(){
    return "Select * from Users where email = ? ";
  }

}
