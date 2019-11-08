create database tafrahTest;

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
