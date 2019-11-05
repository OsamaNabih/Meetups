module.exports = {
    sql: `
    Insert Into Meetups(meetupId,meetupName,capacity,description,price,venue,meetupDate,slogan,district, ticketLink)
    values (1,"helloworld1",50000,"how to procrastinate",0,"my house ",STR_TO_DATE('01-10-2018','%m-%d-%Y'),"Procrastinate FTW","Dokki", "https://paymestore.co/085617");
    
    Insert Into Meetups(meetupId,meetupName,capacity,description,price,venue,meetupDate,slogan,district, ticketLink)
    values (2,"helloworld2",4165000,"how to procrastinate",33,"my house ",STR_TO_DATE('01-09-2018','%m-%d-%Y'),"Procrastinate FTW","Dokki", "https://paymestore.co/085617");
    
    Insert Into Users(userId,email,firstName,lastName,authField,authType,userType,birthDate,position, imagePath)
    Values(1,"user3@gmail.com", "Real", "Person", "1111",1, 2, 19900602, "Junior back-end developer", "Images/default-avatar.png");

    Insert Into Users(userId,email,firstName,lastName,authField,authType,userType,birthDate,position, imagePath)
    Values(2,"user4@gmail.com", "Very", "Enthusiastic", "2222",1, 2, 19900413, "Machine Learning Engineer", "Images/default-avatar.png");

    Insert Into Users(userId,email,firstName,lastName,authField,authType,userType,birthDate,position, imagePath)
    Values(3,"user5@gmail.com", "Techie", "Goals", "randomFacebookToken23qwekmlkdmasd90i3e39msmdakmalksd",2, 2, 19900413, "Senior Machine Learning Engineer", "Images/default-avatar.png");

    Insert Into Users(userId,email,firstName,lastName,authField,authType,userType,birthDate,position, imagePath)
    Values(4,"user6@gmail.com", "Google", "Rocks", "randomGoogleTokena2sd6lklm9asd3",3, 1, 19900413, "Senior Machine Learning Engineer", "Images/default-avatar.png");

    Insert Into Users(userId,email,firstName,lastName,authField,authType,userType,birthDate,position, imagePath)
    Values(5,"admin@gmail.com", "Test", "Admin", "$2a$10$qECNSpwdIe.kacmtEakDuuuqcXPC2WkZqHqQrNJ1sAMb2PA2mo0hm",1, 1, 19900413, "The admin", "Images/default-avatar.png");
    Insert Into Spoke_In(speakerId, meetupId)
    values
    (2,1);
    Insert Into Spoke_In(speakerId, meetupId)
    values
    (1,1);
    Insert Into Spoke_In(speakerId, meetupId)
    values
    (3,2);
    Insert Into Attended(userId, meetupId, verified)
    values
    (2,1,1);
    Insert Into Attended(userId, meetupId)
    values
    (1,2);
    Insert Into Attended(userId, meetupId, verified)
    values
    (3,2,1);
    Insert Into FormQuestions(meetupId,questionId,question,questionType,required,feedback) 
    values
    (1,1,"What are your hopes and dreams?",1,0,0);
    Insert Into FormQuestions(meetupId,questionId,question,questionType,required,feedback) 
    values
    (1,2,"What are your hopes and dreams?",1,2,0);
    Insert Into FormOptions(meetupId,questionId,optionId,optionString)
    values
    (1,2,1,"this");
    Insert Into FormOptions(meetupId,questionId,optionId,optionString)
    values
    (1,2,2,"that");
    Insert Into FormReplies(meetupId,questionId,userId,userReply)
    values
    (1,1,2,"Nothing, i am hopeless");
    Insert Into FormReplies(meetupId,questionId,userId,userReply)
    values
    (1,1,3,"I have so much, but if i tell you i'll have to kill you."); 
    Insert Into FormOptionReplies(meetupId,questionId,userId,optionId)
    values
    (1,2,1,2);
    Insert Into FormOptionReplies(meetupId,questionId,userId,optionId)
    values
    (1,2,2,1);
    `
}