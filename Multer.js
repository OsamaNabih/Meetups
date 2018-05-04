const multer = require('multer');
const path = require('path');


//Set Storage Engine;
const storage = multer.diskStorage({
destination:'./Images',
filename: function(req,file,cb){
  cb(null,file.filename + '-'+Date.now()+path.extname(file.originalname));
}
});


//Init Upload
const upload=multer({
  storage:storage,
  limits:{fileSize: 20000000},
  fileFilter:function(req,file,cb){
    checkFileType(file,cb);
  }
}).single('MyImage');

module.exports = {

 uploadPhoto : (req,res,next)=>{
  upload(req,res,(err) =>{
    if(err){
      req.error=err;
      console.log("error");
      next(err);
    }
    else{
      console.log("photo is trying to upload itself");
      if(req.file == undefined)
      {/*
        req.error = "No photo selected";
        console.log("No Photo Selected");
        next(req.error);
        */
        console.log("No Photo Selected");
        next();
      }
      else
        next();
    }
  });
}

}
function checkFileType(file,cb){
  // allowed extension
  const filetypes= /jpeg|jpg|png|gif/;
  //check extestion
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  }
  else
  {
    cb('Error:Images only!');
  }
}
