create database Tafrah;

create table Users
(
	UserID int not null auto_increment,
	Email varchar(320) UNIQUE not null,
	FirstName varchar(50) not null,
	LastName varchar(50) not null,
	Password varchar(30) not null,
	UserType ENUM('Admin','Speaker','User') not null, /* 1->Admin, 2 ->Speaker, 3->User,*/
	BirthDate date,
	Position varchar(320),

	Primary key(UserID)
);
Create Table Meetups
(
	MeetupID int not null auto_increment,
	MeetupName  varchar(8000)  not null ,
	Capacity int not null,
	Description text character set utf8 collate utf8_bin,/* the character set utf8 is used to enter ☺,☻,♥ etc in the DB */
	Price int not null,
	Venue varchar(40),
    MeetupDate datetime not null,
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


/*-------------------------------------------------------------------------------------------------------------------
--Inserting some users--*/
Insert Into Users(Email,FirstName,LastName,Password,UserType,BirthDate,Position) 
values ("walidashraf423@gmail.com","waleed","ashraf",123,1,STR_TO_DATE('09-04-2018 00:00:00','%m-%d-%Y %H:%i:%s'),"Professional Procrastinator");

Insert Into Users(Email,FirstName,LastName,Password,UserType,BirthDate,Position) 
values ("OmarWagih@gmail.com","Omar","Wagih",11111,2,STR_TO_DATE('09-04-2018 00:00:00','%m-%d-%Y %H:%i:%s'),"Professional Procrastinator");
 
Insert Into Users(Email,FirstName,LastName,Password,UserType,BirthDate,Position)
values ("OsamaNabih@gmail.com","Osama","Nabih",4444,2,STR_TO_DATE('09-04-2018 00:00:00','%m-%d-%Y %H:%i:%s'),"Professional Procrastinator");
 
Insert Into Users(Email,FirstName,LastName,Password,UserType,BirthDate,Position)
values ("YasmeenAhmed@gmail.com","Yasmeen","Ahmed",5555,1,STR_TO_DATE('09-04-2018 00:00:00','%m-%d-%Y %H:%i:%s'),"Professional Procrastinator"); 
 
 

Insert Into Users
(Email,FirstName,LastName,Password,UserType,BirthDate,Position)
values
("Speaker1@gmail.com", "Speaker1FirstName", "Speaker1LastName", "password1", 1, 19900622, "Machine Learning Engineer at Microsoft");

Insert Into Users
(Email,FirstName,LastName,Password,UserType,BirthDate,Position)
values
("Speaker2@gmail.com","Speaker2FirstName", "Speaker2LastName", "password2", 1, 19941201, "DevOps Engineer at Google");

Insert Into Users(Email,FirstName,LastName,Password,UserType,BirthDate,Position)
values
("Attendee@gmail.com", "Eager", "Learner", 1234, 2, 20010622, "Student");

Insert Into Users(Email,FirstName,LastName,Password,UserType,BirthDate,Position)
Values("Attendee2@gmail.com", "Tafrah", "Lover", "4321", 2, 19950415, "Junior front-end developer");

Insert Into Users(Email,FirstName,LastName,Password,UserType,BirthDate,Position)
Values("Attendee3@gmail.com", "Real", "Person", "1111", 2, 19900602, "Junior back-end developer");

Insert Into Users(Email,FirstName,LastName,Password,UserType,BirthDate,Position)
Values("Attendee4@gmail.com", "Very", "Enthusiastic", "2222", 2, 19900413, "Machine Learning Engineer");

/*--------------------------------------------------------------------------------------------------------------------
Inserting some Meetups--*/
Insert Into Meetups(MeetupName,Capacity,Description,Price,venue,MeetupDate,Slogan,District)
values ("helloworld1",50000,"how to procrastinate",0,"my house ",STR_TO_DATE('09-04-2018 23:30:50','%m-%d-%Y %H:%i:%s'),"Procrastinate FTW","Dokki");
 
Insert Into Meetups(MeetupName,Capacity,Description,Price,venue,MeetupDate,Slogan,District) 
values ("helloworld2",4165000,"how to procrastinate",33,"my house ",STR_TO_DATE('09-04-2018 00:00:00','%m-%d-%Y %H:%i:%s'),"Procrastinate FTW","Dokki");

Insert Into Meetups(MeetupName,Capacity,Description,Price,venue,MeetupDate,Slogan,District)
values ("helloworld3",50000,"how to procrastinate",99,"my house ",STR_TO_DATE('09-04-2018 00:00:00','%m-%d-%Y %H:%i:%s'),"Procrastinate FTW","Dokki");
 
Insert Into Meetups(MeetupName,Capacity,Description,Price,venue,MeetupDate,Slogan,District) 
values ("helloworld4",50000,"how to procrastinate",40,"my house ",STR_TO_DATE('09-04-2018 00:00:00','%m-%d-%Y %H:%i:%s'),"Procrastinate FTW","Dokki");

Insert Into Meetups(MeetupName,Capacity,Description,Price,venue,MeetupDate,Slogan,District)
values ("helloworld5",50000,"how to procrastinate",80,"my house ",STR_TO_DATE('09-04-2018 00:00:00','%m-%d-%Y %H:%i:%s'),"Procrastinate FTW","Dokki");
 
Insert Into Meetups(MeetupName,Capacity,Description,Price,venue,MeetupDate,Slogan,District)
values ("helloworld6",50000,"how to procrastinate",650,"my house ",STR_TO_DATE('09-04-2018 00:00:00','%m-%d-%Y %H:%i:%s'),"Procrastinate FTW","Dokki");
 
Insert Into Meetups(MeetupName,Capacity,Description,Price,venue,MeetupDate,Slogan,District) 
values ("helloworld7",50000,"how to procrastinate",7440,"my house ",19830905202020,"Procrastinate FTW","Dokki");


Insert Into Meetups(MeetupName,Capacity,Description,Price,venue,MeetupDate,Slogan,District) 
value("tafrah meetup #05: artificial intelligence potential",60,"The potential behind Artificial Intelligence is increasing every day with disrupting industries. Didn’t you wonder how can that solve challenges human race face till now such as healthcare ones! What are the actual insights and case studies regardless the hype of facebook posts! How can we connect all the dots from data science to machine learning to learn and develop such helpful solutions?

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

Tafrah - Empowering Techies",120,"AUC Main Campus",20180317120001,"Artificial Intelligence Potential","Tahrir");


Insert Into Meetups(MeetupName,Capacity,Description,Price,venue,MeetupDate,Slogan,District) 
values ("Tafrah Meetup #06: DevOps 101",60,"Whether you are reading this as DevOps Engineer or enthusiast about the topic, Didn’t you question yourself at the very beginning when you heard about this term -DevOps- Is it a new Technology? Or just a practice and philosophy? Has it something linked between Software Operations and Software Development only? Didn’t you wonder before about the history of it? How is the global companies and the local ones dealing with it? How Agile methodologies for planning and development do affect on DevOps? Is there a difference when it comes to SysAdmins Vs DevOps? 

This round of #Tafrah_Meetup, we will be tackling a glimpse of the journey of DevOps starting from how was it in the past going through the present state and what do we expect in the future, meeting different experienced people to share with you their insights and hands on experience and also getting to know Tafrah DevOps Community.

Join 4 Hrs of #Tafrah_Meetup to engage, learn, get to know the community and have answers for all the topics mentioned above.

- For whom this Meetup:
1. Development and Quality Team Leaders. 
2. Junior/Senior DevOps Engineers.
3. Software Engineers.
4. IT Department Lead.
5. CIOs.
6. CTOs
7. Everyone who is passionate about building reliable systems.
8. Interested in platform automation, delivering continuously and monitoring distributed systems.
9. CEOs and Founders of Technology-Based Ventures.
10. Interested Students & Fresh Graduates.

- We will be tackling the following:
1. History of DevOps.
2. Fundamentals of DevOps.
3. Toolchain Stages.
4. What to do to pursue a career in DevOps?
5. How to apply for a Job in DevOps in Europe?
6. Linux Adminstration.
7. Career Opportunities inside and outside Egypt.

- Venue, Date, Time & Duration:
302Labs - G2 Room
Saturday 31-03-2018
(13:00 to 17:00)
4 Essential Hours for DevOps Enthusiasts and Practitioners.

- Meetup Agenda:
13:00-13:30 … Keynote, Ice Breaking & Networking Activity
13:30-14:30 … Talk #01
14:30-14:45 … Coffee Break
14:45-15:45 … Career Opportunities, Working experience in Germany and DevOps future by Mohamed Zeineldin - Know more: https://goo.gl/WWq46z
15:45-16:00 … Alasr Prayer Break + Coffee Break
16:00-17:00 … System Administration Vs. DevOps - a hands-on approach by Rehab Hassanein - Know more: https://goo.gl/Hje9UA

- Who’re the Speakers?
1- Mohamed Zeineldin, Senior DevOps Engineer at Leverton GmbH.
2- Rehab Hassanein, Senior Linux Administrator | DevOps

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
And know us more :)

- How to attend?
Two stages, Registration and Investment.
1) Registration
through here: https://goo.gl/forms/5gOd1XYvX0h9hy4F3

2) Submit your investment
Step 1: Go to the payment page (https://paymestore.co/085613) and choose no. of tickets you need to buy.

Step 2: Sign up, Enter your name and mobile number correctly and fill randomly what’s else required randomly.

Step 3: Now go again to the payment page, choose your needed no. of tickets and enjoy paying either cash (through fawry, atm or wallets) or paying online (through credit card).

- Investment Fees:
★Early Bird Ticket: 120 EGP - till Monday 26-03-2018
★Late Owl Ticket: 150 EGP - Starting from Tuesday 27-03-2018

P.S. Registration for the Meetup is a MUST. We have very limited seats due to the capacity of the venue .. so hurry up reserving your seat in early bird period!

Materials and Talks will be conducted in Arabic/English.

For any inquiries, please call us on +201111733122

- Who are we?
Tafrah is a platform that empowers MENA region techies to disrupt tech industries worldwide. We’re capable of doing that through our products.
We started with conducting frequent rich meetups for techies (juniors/seniors) through #Tafrah_Meetup to tackle the latest updates and best practices, networking with like-minded people and enriching the mindsets with technical/non-technical experiences.

Tafrah - Empowering Techies",120,"302Labs",20180331010000 ,"DevOps 101","Nasr City");
/*--------------------------------------------------------------------------------------------------------------------
Attaching speakers to meetups*/
/*
Insert Into Spoke_In(SpeakerID, MeetupID)
values
(2,8);
Insert Into Spoke_In(SpeakerID, MeetupID)
values
(5,8);
Insert Into Spoke_In(SpeakerID, MeetupID)
values
(6,8);
Insert Into Spoke_In(SpeakerID, MeetupID)
values
(2,9);
Insert Into Spoke_In(SpeakerID, MeetupID)
values
(5,9);
Insert Into Spoke_In(SpeakerID, MeetupID)
values
(6,9);
Insert Into Spoke_In(SpeakerID, MeetupID)
values
(2,1);
Insert Into Spoke_In(SpeakerID, MeetupID)
values
(5,1);
Insert Into Spoke_In(SpeakerID, MeetupID)
values
(6,1);
Insert Into Spoke_In(SpeakerID, MeetupID)
values
(2,2);
Insert Into Spoke_In(SpeakerID, MeetupID)
values
(5,3);
Insert Into Spoke_In(SpeakerID, MeetupID)
values
(6,4);
Insert Into Spoke_In(SpeakerID, MeetupID)
values
(5,5);
Insert Into Spoke_In(SpeakerID, MeetupID)
values
(6,6);
Insert Into Spoke_In(SpeakerID, MeetupID)
values
(5,2);

/*--------------------------------------------------------------------------------------------------------------------
Attaching attendees to meetups*/
/*
Insert Into Attended(AttendeeID, AttendedEventID)
values
(3,8);
Insert Into Attended(AttendeeID, AttendedEventID)
values
(7,8);
Insert Into Attended(AttendeeID, AttendedEventID)
values
(8,8);
Insert Into Attended(AttendeeID, AttendedEventID)
values
(9,8);
Insert Into Attended(AttendeeID, AttendedEventID)
values
(10,8);
Insert Into Attended(AttendeeID, AttendedEventID)
values
(3,9);
Insert Into Attended(AttendeeID, AttendedEventID)
values
(7,9);
Insert Into Attended(AttendeeID, AttendedEventID)
values
(8,9);
Insert Into Attended(AttendeeID, AttendedEventID)
values
(9,9);
Insert Into Attended(AttendeeID, AttendedEventID)
values
(10,9);
Insert Into Attended(AttendeeID, AttendedEventID)
values
(3,1);
Insert Into Attended(AttendeeID, AttendedEventID)
values
(7,1);
Insert Into Attended(AttendeeID, AttendedEventID)
values
(8,2);
Insert Into Attended(AttendeeID, AttendedEventID)
values
(9,2);
Insert Into Attended(AttendeeID, AttendedEventID)
values
(10,3);
Insert Into Attended(AttendeeID, AttendedEventID)
values
(3,5);
Insert Into Attended(AttendeeID, AttendedEventID)
values
(7,5);
Insert Into Attended(AttendeeID, AttendedEventID)
values
(8,5);
Insert Into Attended(AttendeeID, AttendedEventID)
values
(9,6);
Insert Into Attended(AttendeeID, AttendedEventID)
values
(10,6);
Insert Into Attended(AttendeeID, AttendedEventID)
values
(3,7);
Insert Into Attended(AttendeeID, AttendedEventID)
values
(10,7);

/*--------------------------------------------------------------------------------------------------------------------
Some triggers performing checks on insertions--*/
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