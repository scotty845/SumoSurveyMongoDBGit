//mongodb commands: http://howtonode.org/node-js-and-mongodb-getting-started-with-mongojs
//http://docs.mongodb.org/manual/reference/mongo-shell/

/*var databaseURI = "localhost:27017/somedb";
var collections = ["users", "blogs"];
var db = require("mongojs").connect(databaseURI, collections);

module.exports = db;

and then just require it where you need to connect to mongo like:

var db = require("./db");
*/

var express = require('express');
var app = express();
var mongojs = require('mongojs');
//var db = mongojs('AddressBook', ['Persons']);
var db = mongojs('sumosurveydb', ['questions']);

var bodyParser = require('body-parser');

app.use(express.static(__dirname));
app.use(bodyParser.json());

db.questions.find(function(err, docs){
		//console.log(docs);
		console.log(docs[0].question.answers[2].answerText);
		
		for(x=0;x<docs.length;x++){
		//console.log(docs[0].answers);
			//for(y=0;y<docs[x].answers[y].length;y++)
			//{
			//	console.log(docs[y].answers);
			//}
		}
		//for (var i = 0; i < docs.question.length; i++) { 
    //console.log(docs.answers[i].answerText);
//}
		
		 //_id: 56fc39ebed2950905673c2b6
		db.questions.findOne({_id: new mongojs.ObjectId('56fc39ebed2950905673c2b6')}, function(err, findone){
		console.log(findone);
		//res.json(docs);
	    })
		
		
		//{questionText:'What is your favorite taco?'}, 
		//"What is your favorite taco?"
		db.questions.find(  {
              "question.questionText": "What is your favorite taco?",
              //last: "Matsumoto"
           
    },
		
		function(err, findone2){
		console.log(findone2);
		//res.json(docs);
	    })
		
		
		
		
		
		
		
		//res.json(docs);
	})

/*
app.get('/persons', function(req, res){
	console.log('Received find all persons request');
	db.Persons.find(function(err, docs){
		console.log(docs);
		res.json(docs);
	})
});



app.get('/person/:id', function(req, res){
	console.log('Received findOne person request');
	db.Persons.findOne({_id: new mongojs.ObjectId(req.params.id)}, function(err, docs){
		console.log(docs);
		res.json(docs);
	})
});

app.post('/addPerson', function(req, res){
	console.log(req.body);
	db.Persons.insert(req.body, function(docs){
		console.log(docs);
		res.json(docs);
	})
});

app.delete('/deletePerson/:id', function(req, res){
	console.log("Received delete one person request...");
	db.Persons.remove({_id: new mongojs.ObjectId(req.params.id)}, function(err, docs){
		console.log(docs);
		res.json(docs);
	});
});

app.put('/updatePerson', function(req, res){
	console.log("Received updatePerson request");
	db.Persons.findAndModify({query: {"_id": new mongojs.ObjectId(req.body._id)}, 
										update: {$set: {name: req.body.name, email: req.body.email, number: req.body.number}}
										}, function(err, docs){
											console.log(docs);
											res.json(docs);
										})
	});

*/


	
//app.use(express.static(__dirname + "/app/views"));
app.listen(3000);
console.log("server running on port 3000");