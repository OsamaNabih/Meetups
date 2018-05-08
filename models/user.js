module.exports = {
  InsertUser:  function(){
    return "Insert Into Users set ?";
  },
  GetUserId: function(){
    return "Select userId from Users where email = ?";
  },
  GetUserIdAndTypeByEmail: function(){
    return "Select userId, userType from Users where email = ?";
  },
  GetUserIdAndTypeById: function(){
    return "Select userId, userType from Users where userId = ?";
  },
  GetUser: function(){
    return "Select * from Users where email = ?";
  },
  GetUserById: function(){
    return "Select * from Users where userId = ?";
  }
}
