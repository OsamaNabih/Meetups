create database Tafrah;

create table Users
(
	UserID int not null auto_increment,
	Email varchar(320) not null,
	FirstName varchar(20) not null,
	LastName varchar(20) not null,
	Password varchar(30) not null,
	UserType int not null,
	BirthDate date,
	Position varchar(320),

	Primary key(UserID)
);
Create Table Meetups
(
	MeetupID int not null auto_increment,
	MeetupName  varchar(8000)  not null ,
	Capacity int not null,
	Description text ,
	Price int not null,
	Venue varchar(40),
    date datetime not null,
	Slogan varchar(400),
	District varchar(200),
	Primary key(MeetupID)
);

Create Table Spoke_In
(
	SpeakerID int not null,
	MeetupID int not null,
	Primary key(SpeakerID, MeetupID),
	Foreign key(SpeakerID) references Users(UserID) On Delete cascade On Update cascade,
	Foreign key(MeetupID) references Meetups(MeetupID) On Delete cascade On Update cascade
);

create table Attended
(
	AttendeeID int not null,
	AttendedEventID int not null,

	Primary key (AttendeeId,AttendedEventID),
	Foreign key (AttendeeID) references Users(UserID) on delete cascade,
	Foreign key (AttendedEventID) references Meetups(MeetupID)
);

create table Images
(
	MeetupID int not null,
    ImageURL varchar(400) not null,
    Primary Key (MeetupID,ImageURL),
    Foreign Key(MeetupID) references Meetups(MeetupID) on delete cascade on update cascade
);
delimiter $$

create trigger Capcity before insert on Meetups
for each row
begin
if new.Capacity <= 0  then
set new.Capacity = NULL ;
end if;
if new.Price <= 0 then
set new.Price = NULL;
end if;
end$$


delimiter $$
create trigger foo before insert on Users
for each row
begin
if new.UserType > 2   then
set new.UserType = NULL ;
end if ;
if new.UserType < 0 then
set new.UserType=NULL;
end if;
end$$
