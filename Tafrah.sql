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
    Date datetime not null,
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

--------------------------------------------------------------------------------------------------------------------
--Inserting some users--
Insert Into Users(Email,FirstName,LastName,Password,UserType,BirthDate,Position) 
values ("walidashraf423@gmail.com","waleed","ashraf",123,0,14/4/1997,"Professional Procrastinator"); 

Insert Into Users(Email,FirstName,LastName,Password,UserType,BirthDate,Position) 
values ("OmarWagih@gmail.com","Omar","Wagih",11111,1,14/4/1997,"Professional Procrastinator"); 

Insert Into Users(Email,FirstName,LastName,Password,UserType,BirthDate,Position) 
values ("OsamaNabih@gmail.com","Osama","Nabih",4444,2,14/4/1997,"Professional Procrastinator"); 

Insert Into Users(Email,FirstName,LastName,Password,UserType,BirthDate,Position) 
values ("YasmeenAhmed@gmail.com","Yasmeen","Ahmed",5555,0,14/4/1997,"Professional Procrastinator"); 

--------------------------------------------------------------------------------------------------------------------
--Inserting some Meetups--
Insert Into Meetups(MeetupName,Capacity,Description,Price,venue,Date,Slogan,Disrtict) 
values ("helloworld1",50000,"how to procrastinate",0,"my house ",14/4/1997,"Procrastinate FTW",Dokki);

Insert Into Meetups(MeetupName,Capacity,Description,Price,venue,Date,Slogan,Disrtict) 
values ("helloworld2",4165000,"how to procrastinate",33,"my house ",14/4/1997,"Procrastinate FTW",Dokki);

Insert Into Meetups(MeetupName,Capacity,Description,Price,venue,Date,Slogan,Disrtict) 
values ("helloworld3",501566000,"how to procrastinate",04212,"my house ",14/4/1997,"Procrastinate FTW",Dokki);

Insert Into Meetups(MeetupName,Capacity,Description,Price,venue,Date,Slogan,Disrtict) 
values ("helloworld4",56260,"how to procrastinate",584,"my house ",14/4/1997,"Procrastinate FTW",Dokki);

Insert Into Meetups(MeetupName,Capacity,Description,Price,venue,Date,Slogan,Disrtict) 
values ("helloworld5",15616,"how to procrastinate",3165,"my house ",14/4/1997,"Procrastinate FTW",Dokki);

Insert Into Meetups(MeetupName,Capacity,Description,Price,venue,Date,Slogan,Disrtict) 
values ("helloworld6",9491,"how to procrastinate",6186,"my house ",14/4/1997,"Procrastinate FTW",Dokki);


--------------------------------------------------------------------------------------------------------------------
--Some triggers performing checks on insertions--
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


