
Demo on Heroku: https://lit-springs-62782.herokuapp.com/#/SumoSurvey

To make surveys on Heroku can use demo user to
  Demo User Info: username mmusashi password: blade
  Login and Make Surveys With Questions and Answers
  View Results To Your Survey Questions and Answers Number Of Votes Per Answer Per Question and  Percentage 
  Edit Survey Questions and Answers
  Add Survey Questions Add Survey Answers
  Delete Survey Questions, Delete Survey Answers




Description Of Project:

Sumo Survey MongoDB
Description

Guest: Take Survey 
1)When a guest visits the app in a browser it  presents a random survey question to the guest. 

2)The app avoids showing a previously answered question to the same guest based on ip adress tracking.

3)The guest then can take the survey question and there answer is recorded into a mongodb database collection

Admin: Make Survey
The app  allows an admin to enter survey questions with multiple choice answers. 
1)The admin can add edit delete question and answers that they have created.
2)The admin can view survey results answers and number of votes total and per voted answer that they have created.


Technologies:
Back End Server
Node.js 
Express
Node.js MongoDB implemented with node module mongojs
Underscore

Front End Display and Test
AngularJS
Tested On:
Mozilla Firefox 44.0.2 
Google Chrome	49.0.2623.87 (Official Build) m (32-bit)
Mobile Phones Tested For Responsive Design
1)Samsung Model Number SM-G360P  OS: Android Version 4.4
Tested In Browsers On Device
a) Chrome 49.0.2623.105
   Chrome For Android
b) Firefox 45.0.2
   Firefox For Android
2)Moto E (2nd generation ) OS: Android version 5.1
Tested In Browsers On Device
a) Chrome 50.0.2661.89
   Chrome For Android
b) Firefox 46.0
   Firefox For Android



Database
MongoDB

To Utilize Back End Mongodb Database:
consists of three collections in sumosurveydb
a)db.questions
b)db.surveyusers
c)db.surveyadmin

1)Set up the mongodb 
use mongod command from one shell console 
use mongo.exe from a seperate shell console
in this console type command use sumosurveydb
create some entries in the dbsurveyadmin collection
so you will have login acess
db.surveyadmin
here are sample insertions but you can also create your own

create user uname: hhanzo pass: sword -

db.surveyadmin.insert(
   {     
      'uname': 'hhanzo',
      'pass':  'sword',
      "createDate" : ISODate("2014-10-01T00:00:00Z"),
      "updateDate" : ISODate("2014-10-01T00:00:00Z")

    }
 )   


create user uname: wchurchill pass: england -

db.surveyadmin.insert(
   {     
      'uname': 'wchurchill',
      'pass':  'england',
      "createDate" : ISODate("2014-10-01T00:00:00Z"),
      "updateDate" : ISODate("2014-10-01T00:00:00Z")

    }
 )   



Has project dependicies in node_modules folder

From shell console change to directory with sumosurveyserver.js

Run node sumosurveyserver to start server 

Browse to localhost:3000 on your web browser
Tested On:
Mozilla Firefox 44.0.2 
Google Chrome	49.0.2623.87 (Official Build) m (32-bit)

To Take Surveys Click On Take Survey
From there guests can take multiple choice survey questions

To Make Surveys Click On Make Survey
Make Survey Requires Admin Login
Can Use Admins in db.surveyadmin you created to login

username: hhanzo password:sword
or
username: wchurchill password:england
or whatever login credentials you created

The admin that logs in will only be able to
view, add,edit,create,delete there set of survey questions and answers

From There Admin Can 
Login
Add Questions
Add Answers
Edit Questions
Edit Answers
Delete Questions
Delete Answers
View Survey Results 
a)Total Number Of Votes By Question
b)Total Number Of Votes Per Answer
Logout



