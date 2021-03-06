create database Tafrah;

create table Users
(
	userId int not null auto_increment,
	email varchar(320) UNIQUE not null,
	firstName varchar(50) not null,
	lastName varchar(50) not null,
	authField varchar(200) not null,
	authType int not null, /* 1->Local, 2->Facebook, 3->Google */
	userType int not null, /* 1->Admin, 2 ->Speaker, 3->User,*/
	birthDate date,
  imagePath text,
	position varchar(320),
	aboutme text,
	Primary key(userId)
);

Create Table Meetups
(
	meetupId int not null auto_increment,
	meetupName  varchar(500)  not null ,
	capacity int not null,
	description text character set utf8 collate utf8_bin,/* the character set utf8 is used to enter ☺,☻,♥ etc in the DB */
	price int not null,
	venue varchar(40),
  meetupDate date not null,
	startTime time not null,
	endTime time not null,
	longitude DOUBLE(16, 14) DEFAULT 31.2372225 not null,
	latitude DOUBLE(16, 14) DEFAULT 30.0443319 not null,
	ticketLink text,
	slogan varchar(400),
	district varchar(200),
	Primary key(meetupId)
);

Create Table Spoke_In
(
	speakerId int not null,
	meetupId int not null,
	Primary key(speakerId, meetupId),
	Foreign key(speakerId) references Users(userId) On Delete cascade On Update cascade,
	Foreign key(meetupId) references Meetups(meetupId) On Delete cascade On Update cascade
);

create table Attended
(
	userId int not null,
	meetupId int not null,
	verified boolean not null default 0,
	Primary key (userId,meetupId),
	Foreign key (userId) references Users(userId) On Delete cascade On Update cascade,
	Foreign key (meetupId) references Meetups(meetupId) On Delete cascade On Update cascade
);

create table Images
(
	meetupId int not null,
    imagePath varchar(400) not null,
    Primary Key (meetupId,imagePath),
    Foreign Key(meetupId) references Meetups(meetupId) on delete cascade on update cascade
);

create table FormQuestions
(
	meetupId int not null,
	questionId tinyint UNSIGNED not null,
	question text not null,
	questionType int not null, /*1 is a text question, 2 is a radio button, 3 is a checkbox */
	required bool not null,
	feedback bool not null,    /* 0 question 1 feedback */
	Primary Key(meetupId, questionId),
	Foreign Key(meetupId) references Meetups(meetupId) on delete cascade on update cascade
);

create table FormOptions
(
	meetupId int not null,
	questionId tinyint UNSIGNED not null,
	optionId tinyint UNSIGNED not null,
	optionString tinytext not null,
	Primary Key(meetupId, questionId, optionId),
	Foreign Key(meetupId, questionId) references FormQuestions(meetupId, questionId) on delete cascade on update cascade
);

create table FormReplies
(
	meetupId int not null,
	questionId tinyint UNSIGNED not null,
	userId int not null,
	userReply text not null,
	Primary Key(meetupId, questionId, userId),
	Foreign Key(meetupId, questionId) references FormQuestions(meetupId, questionId) on delete cascade on update cascade,
	Foreign Key(userId) references Users(userId) on delete cascade on update cascade
);

create table FormOptionReplies
(
	meetupId int not null,
	questionId tinyint UNSIGNED not null,
	userId int not null,
	optionId tinyint UNSIGNED not null,
	Primary Key(meetupId, questionId, userId, optionId),
	Foreign Key(meetupId, questionId, optionId) references FormOptions(meetupId, questionId, optionId) on delete cascade on update cascade,
	Foreign Key(userId) references Users(userId) on delete cascade on update cascade
);
/*
-------------------------------------------------------------------------------------------------------------------
--Inserting some users--



-------------------------------------------------------------------------------------------------------------------
--Inserting some users--
*/
Insert Into Users(email,firstName,lastName,authField,authType,userType,birthDate,position, imagePath)
values ("walidashraf423@gmail.com","waleed","ashraf",123,1,1,STR_TO_DATE('09-04-2018 00:00:00','%m-%d-%Y %H:%i:%s'),"Professional Procrastinator", "Images/default-avatar.png");

Insert Into Users(email,firstName,lastName,authField,authType,userType,birthDate,position, imagePath)
values ("OmarWagih@gmail.com","Omar","Wagih",11111,1,2,STR_TO_DATE('09-04-2018 00:00:00','%m-%d-%Y %H:%i:%s'),"Professional Procrastinator", "Images/default-avatar.png");

Insert Into Users(email,firstName,lastName,authField,authType,userType,birthDate,position, imagePath)
values ("OsamaNabih@gmail.com","Osama","Nabih",4444,1,3,STR_TO_DATE('09-04-2018 00:00:00','%m-%d-%Y %H:%i:%s'),"Professional Procrastinator", "Images/Osama.jpg");

Insert Into Users(email,firstName,lastName,authField,authType,userType,birthDate,position, imagePath)
values ("YasmeenAhmed@gmail.com","Yasmeen","Ahmed",5555,1,1,STR_TO_DATE('09-04-2018 00:00:00','%m-%d-%Y %H:%i:%s'),"Professional Procrastinator", "Images/default-avatar.png");



Insert Into Users
(email,firstName,lastName,authField,authType,userType,birthDate,position, imagePath)
values
("Speaker1@gmail.com", "Speaker1firstName", "Speaker1lastName", "authField1",1, 2, 19900622, "Machine Learning Engineer at Microsoft", "Images/default-avatar.png");

Insert Into Users
(email,firstName,lastName,authField,authType,userType,birthDate,position, imagePath)
values
("Speaker2@gmail.com","Speaker2firstName", "Speaker2lastName", "authField2",1, 2, 19941201, "DevOps Engineer at Google", "Images/default-avatar.png");

Insert Into Users(email,firstName,lastName,authField,authType,userType,birthDate,position, imagePath)
values
("user@gmail.com", "Eager", "Learner", 1234,1, 3, 20010622, "Student", "Images/default-avatar.png");

Insert Into Users(email,firstName,lastName,authField,authType,userType,birthDate,position, imagePath)
Values("user2@gmail.com", "Tafrah", "Lover", "4321",1, 3, 19950415, "Junior front-end developer", "Images/default-avatar.png");

Insert Into Users(email,firstName,lastName,authField,authType,userType,birthDate,position, imagePath)
Values("user3@gmail.com", "Real", "Person", "1111",1, 3, 19900602, "Junior back-end developer", "Images/default-avatar.png");

Insert Into Users(email,firstName,lastName,authField,authType,userType,birthDate,position, imagePath)
Values("user4@gmail.com", "Very", "Enthusiastic", "2222",1, 3, 19900413, "Machine Learning Engineer", "Images/default-avatar.png");

Insert Into Users(email,firstName,lastName,authField,authType,userType,birthDate,position, imagePath)
Values("user5@gmail.com", "Techie", "Goals", "randomFacebookToken23qwekmlkdmasd90i3e39msmdakmalksd",2, 3, 19900413, "Senior Machine Learning Engineer", "Images/default-avatar.png");

Insert Into Users(email,firstName,lastName,authField,authType,userType,birthDate,position, imagePath)
Values("user6@gmail.com", "Google", "Rocks", "randomGoogleTokena2sd6lklm9asd3",3, 3, 19900413, "Senior Machine Learning Engineer", "Images/default-avatar.png");

Insert Into Users(email,firstName,lastName,authField,authType,userType,birthDate,position, imagePath)
Values("admin@gmail.com", "Test", "Admin", "$2a$10$qECNSpwdIe.kacmtEakDuuuqcXPC2WkZqHqQrNJ1sAMb2PA2mo0hm",1, 1, 19900413, "The admin", "Images/default-avatar.png");

/*--------------------------------------------------------------------------------------------------------------------
Inserting some Meetups--*/

Insert Into Meetups(meetupName,capacity,description,price,venue,meetupDate,slogan,district, ticketLink)
values ("helloworld1",50000,"how to procrastinate",0,"my house ",STR_TO_DATE('01-10-2018','%m-%d-%Y'),"Procrastinate FTW","Dokki", "https://paymestore.co/085617");

Insert Into Meetups(meetupName,capacity,description,price,venue,meetupDate,slogan,district, ticketLink)
values ("helloworld2",4165000,"how to procrastinate",33,"my house ",STR_TO_DATE('01-09-2018','%m-%d-%Y'),"Procrastinate FTW","Dokki", "https://paymestore.co/085617");

Insert Into Meetups(meetupName,capacity,description,price,venue,meetupDate,slogan,district, ticketLink)
values ("helloworld3",50000,"how to procrastinate",99,"my house ",STR_TO_DATE('01-08-2018','%m-%d-%Y'),"Procrastinate FTW","Dokki", "https://paymestore.co/085617");

Insert Into Meetups(meetupName,capacity,description,price,venue,meetupDate,slogan,district, ticketLink)
values ("helloworld4",50000,"how to procrastinate",40,"my house ",STR_TO_DATE('01-07-2018','%m-%d-%Y'),"Procrastinate FTW","Dokki", "https://paymestore.co/085617");

Insert Into Meetups(meetupName,capacity,description,price,venue,meetupDate,slogan,district, ticketLink)
values ("helloworld5",50000,"how to procrastinate",80,"my house ",STR_TO_DATE('01-06-2018','%m-%d-%Y'),"Procrastinate FTW","Dokki", "https://paymestore.co/085617");

Insert Into Meetups(meetupName,capacity,description,price,venue,meetupDate,slogan,district, ticketLink)
values ("helloworld6",50000,"how to procrastinate",650,"my house ",STR_TO_DATE('01-05-2018','%m-%d-%Y'),"Procrastinate FTW","Dokki", "https://paymestore.co/085617");

Insert Into Meetups(meetupName,capacity,description,price,venue,meetupDate,slogan,district, ticketLink)
values ("helloworld7",50000,"how to procrastinate",7440,"my house ",20170205,"Procrastinate FTW","Dokki", "https://paymestore.co/085617");


Insert Into Meetups(meetupName,capacity,description,price,venue,meetupDate,slogan,district, ticketLink)
value("Tafrah meetup #05: artificial intelligence potential",60,"The potential behind Artificial Intelligence is increasing every day with disrupting industries. Didn’t you wonder how can that solve challenges human race face till now such as healthcare ones! What are the actual insights and case studies regardless the hype of facebook posts! How can we connect all the dots from data science to machine learning to learn and develop such helpful solutions?

This round of #Tafrah_Meetup, we will be tackling the journey of Artificial Intelligence starting from how was it in the past going through the present state and what do we expect in the future, with focus on healthcare case studies, meeting different experienced people to share with you their insights and hands on experience and also getting to know a glimpse of Tafrah Artificial Intelligence community.

Join 5 Hrs of #Tafrah_Meetup to engage, learn and have answers for all the topics mentioned above.

- For whom this Meetup:
1. AI and Machine Learning researchers and teaching assistants.
2. Junior/Senior Product Managers working on machine learning products.
3. Junior/Senior Business Analysts working on machine learning products..
4. Development and Quality Team Leaders working on machine learning products.
5. Junior/Senior machine learning developers.
6. Founders of AI-Based startups.
7. CTOs.
8. CIOs.
9. Interested Students.

- We will be tackling the following:
1. Artificial Intelligence, Past, Present and Future.
2. The connection between Artificial Intelligence, Machine Learning and Data Science.
3. Artificial Intelligence in healthcare industry, its impact and applications.
4. How the latest AI technologies and capabilities will solve healthcare’s toughest problems.
5. Practical case studies of the artificial intelligence in healthcare.
6. Non technical skills and best practices for machine learning developers.

- Venue, Date, Time & Duration:
American University in Cairo -AUC-, Downtown Campus, Hill House 602.
Saturday 17-03-2018
(12:00 to 17:00)
5 Essential Hours for Artificial Intelligence -AI- & Machine Learning -ML- Enthusiasts and Practitioners.

- Meetup Agenda:
12:00-12:30 … Keynote, Ice Breaking & Networking Activity.
12:30-13:30 … The AI hype between truth and myth by Hossam Elrashidy. - know more: https://goo.gl/V4YC2K
13:30-13:45 … Duhr Prayer + Coffee Break + Networking
13:45-14:45 … Potential Uses of AI in Healthcare Information Systems by Dr. Mohamed Fateen - Know more: https://goo.gl/26nDxK
14:45-15:00 … Coffee Break + Networking
15:00-16:00 … Practical Uses of AI in Healthcare Facilities by Abdelrahman Hosny. - Know more: https://goo.gl/3RhAPR
16:00-16:15 … Asr Prayer + Coffee Break + Networking
16:15-17:15 … How to start and Career Opportunities in Data Science/Artificial Intelligence by Omar Amin. - Know more: https://goo.gl/PgXSZy

- Who’re the Speakers?
1. Hossam El Rashidy, Co-Founder and CEO of Humachina.
2. Dr. Mohamed Fateen, Lecturer & Consultant of Hematological Pathology and Specialist of Hematology.
3. Abdelrahman Hosny, Research and Development Engineer at xWare Integrated Solutions.
4. Omar Amin, Research and Teaching Assistant at Faculty of Engineering, Ain Shams University.

- Why to attend #Tafrah_Meetup?
★Getting to know like-minded people in your industry.
★Getting to know the seniors, resources and the shortest routes for gaining a lot of knowledge and insights.
★Meeting your potential mentor, favorite speaker, unexpected old friend or maybe future friend.
★Having clear practical answers on the questions you have on the mentioned topics.
★Being up to date and tackling the latest news.
★Attending one of a kind meetup.
★Enjoying snacks and hot drinks for free.
★Engaging in fruitful technical sessions.
★Gaining hands-on experience in non-technical sessions.
★Building a strong network through Tafrah networking activities.
★Enjoying a 20% off on the next meetup by attending this meetup.

- How to attend?
Two stages, Registration and Investment.
1) Registration
through here: https://goo.gl/ZYxPBL

2) Submit your investment
Step 1: Go to the payment page (https://www.paymestore.co/085611) and choose no. of tickets you need to buy.

Step 2: Sign up, Enter your name and mobile number correctly and fill randomly what’s else required randomly.

Step 3: Now go again to the payment page, choose your needed no. of tickets and enjoy paying either cash (through fawry, atm or wallets) or paying online (through credit card).

- Investment Fees:
★Early Bird Ticket: 120 EGP - till Monday 12-03-2018
★Late Owl Ticket: 170 EGP - Starting from Tuesday 13-03-2018

P.S. Registration for the Meetup is a MUST. We have very limited seats due to the capacity of the venue .. so hurry up reserving your seat in early bird period!

Materials and Talks will be conducted in Arabic/English.

For any inquiries, please call us on +201111733122

- Who are we?
Tafrah is a platform that empowers MENA region techies to disrupt tech industries worldwide. We’re capable of doing that through our products.
We started with conducting frequent rich meetups for techies (juniors/seniors) through #Tafrah_Meetup to tackle the latest updates and best practices, networking with like-minded people and enriching the mindsets with technical/non-technical experiences.

Tafrah - Empowering Techies",120,"AUC Main Campus",20200317,"Artificial Intelligence Potential","Tahrir", "https://paymestore.co/085617");


Insert Into Meetups(meetupName,capacity,description,price,venue,meetupDate,slogan,district, ticketLink)
values ("Tafrah meetup #05: artificial intelligence potential",60,"Empowering Techies",120,"302Labs",20180331 ,"DevOps 101","Nasr City", "https://paymestore.co/085617");
/*--------------------------------------------------------------------------------------------------------------------
Attaching speakers to meetups*/

Insert Into Spoke_In(speakerId, meetupId)
values
(2,8);
Insert Into Spoke_In(speakerId, meetupId)
values
(5,8);
Insert Into Spoke_In(speakerId, meetupId)
values
(6,8);
Insert Into Spoke_In(speakerId, meetupId)
values
(2,9);
Insert Into Spoke_In(speakerId, meetupId)
values
(5,9);
Insert Into Spoke_In(speakerId, meetupId)
values
(6,9);
Insert Into Spoke_In(speakerId, meetupId)
values
(2,1);
Insert Into Spoke_In(speakerId, meetupId)
values
(5,1);
Insert Into Spoke_In(speakerId, meetupId)
values
(6,1);
Insert Into Spoke_In(speakerId, meetupId)
values
(2,2);
Insert Into Spoke_In(speakerId, meetupId)
values
(5,3);
Insert Into Spoke_In(speakerId, meetupId)
values
(6,4);
Insert Into Spoke_In(speakerId, meetupId)
values
(5,5);
Insert Into Spoke_In(speakerId, meetupId)
values
(6,6);
Insert Into Spoke_In(speakerId, meetupId)
values
(5,2);

/*--------------------------------------------------------------------------------------------------------------------
Attaching users to meetups*/
/*
Insert Into Attended(userId, meetupId)
values
(3,1);
Insert Into Attended(userId, meetupId)
values
(7,1);
Insert Into Attended(userId, meetupId)
values
(8,2);
Insert Into Attended(userId, meetupId, verified)
values
(9,2,1);
Insert Into Attended(userId, meetupId)
values
(10,3);
Insert Into Attended(userId, meetupId, verified)
values
(3,5,1);
Insert Into Attended(userId, meetupId)
values
(7,5);
Insert Into Attended(userId, meetupId, verified)
values
(8,5,1);
Insert Into Attended(userId, meetupId)
values
(9,6);
Insert Into Attended(userId, meetupId, verified)
values
(10,6,1);
Insert Into Attended(userId, meetupId)
values
(3,7);
Insert Into Attended(userId, meetupId)
values
(10,7);
Insert Into Attended(userId, meetupId)
values
(3,8);
Insert Into Attended(userId, meetupId)
values
(7,8);
Insert Into Attended(userId, meetupId, verified)
values
(8,8,1);
Insert Into Attended(userId, meetupId)
values
(9,8);
Insert Into Attended(userId, meetupId)
values
(10,8);
Insert Into Attended(userId, meetupId)
values
(3,9);
Insert Into Attended(userId, meetupId)
values
(7,9);
Insert Into Attended(userId, meetupId, verified)
values
(8,9,1);
Insert Into Attended(userId, meetupId, verified)
values
(9,9,1);
Insert Into Attended(userId, meetupId, verified)
values
(10,9,1);
/*--------------------------------------------------------------------------------------------------------------------
Some triggers performing checks on insertions--*/

delimiter $$
create trigger Capacity before insert on Meetups
for each row
begin
if new.capacity <= 0  then
set new.capacity = NULL ;
end if;
if new.price <= 0 then
set new.price = NULL;
end if;
end$$


delimiter $$
create trigger foo before insert on Users
for each row
begin
if new.userType > 3   then
set new.userType = NULL ;
end if ;
if new.userType < 1 then
set new.userType=NULL;
end if;
end$$
