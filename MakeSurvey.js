var express = require( 'express' );
var _ = require( 'underscore' );

//mongodb conection using mongojs
var mongojs = require('mongojs');
var db = mongojs('sumosurveydb', ['questions','surveyusers','surveyadmin']);

var expressValidator = require('express-validator');
var router = express.Router();
var app = express();


//
//router.post /Logout destroy the express-session server data 
//known user username/uname and email/email and userid/uid
//
router.get('/Logout', function(req, res){

//on user logout destroy session data
req.session.destroy(function(err) {
  if(err) {
    console.log(err);
  } else {
    res.json('/MakeSurvey');
  }

});

});
 //
//app.get /Logout destroy express-session data
//
	
// variables to hold session data and log in message
var sess;
var logginMessage;


//
//router.post /Authenticate in verify username and password for log in authentication
//
router.post('/Authenticate', function( req, res, next ) {
	
console.log(req.body);	 
var userName=req.body.username;
var userEmail=req.body.password;	
var stat=0;
     // find(query).limit(1).next(function(err, doc){
   // handle data
//})

	
db.surveyadmin.findOne({"uname": userName,"pass" : userEmail},function(err, surveyAdminLR){
//console.log('the results from db.surveyadmin.find');
//console.log(surveyAdminLR);
//console.log('the results from db.surveyadmin.find');
var surveyAdminLR;
var loginStatus = false;

if (err) { /* handle err */ }

    if (surveyAdminLR !== null) {
        // we have a result that matches
		
		sess = req.session;
		sess.loginStatus = true;
		sess.knownuser = true;
		sess.knownuserUserName = surveyAdminLR.uname;
		 //sess.knownuserUserEmail = results.email;
		sess.knownuserUserUid = surveyAdminLR._id;
	
		 console.log(surveyAdminLR);
		 logginMessage ='Loggin Succesful a Username and Password Match';
		 console.log(logginMessage); 
		 res.end('done');
		
    } else {
        // we don't
		
		sess.loginStatus = false;
		
		console.log(surveyAdminLR);
		logginMessage ='Loggin Unsucessful a Username and Password Do Match';
		console.log(logginMessage);
        res.end('done');
    }

    


})



  
});
//
//app.post /Authenticate in verify username and password for log in authentication
//



//
//  Create Question
//router.post /addQuestion  
//
router.post( '/addQuestion', function( req, res, next ) {
	
	console.log('just did a $http.post(/MakeSurvey/addQuestion, person) ');
    console.log('the form posted question is req.body ' + JSON.stringify(req.body ) );

    var mySurveyNewQuestionText = req.body.questionText;
	console.log('the form posted question is req.body ' + JSON.stringify(mySurveyNewQuestionText ) );
	var mySurveyCreatedBy = req.body.createdByParam;
	

	req.checkBody( 'questionText', 'Question is required.' ).notEmpty(); 
	  
    var errors = req.validationErrors();
	
	console.log('the server side errors using express-validator are errors..' + JSON.stringify(errors) );
    
	if ( errors ) {
        res.json( { errors: errors } );
    } else {
        var myCreatedate = new Date().toISOString()
	    
		
	var newQuestion = {
	  "question" : {
	  questionText: req.body.questionText,
      "createDate" : myCreatedate,
      "updateDate" : myCreatedate,
      "createdBy"   : new mongojs.ObjectId(req.body.createdByParam),
      "answers" : []
        }
	   }	
	

	
	  db.questions.insert(newQuestion, function(err,result){
		
		console.log("Record added as "+result);
		res.json( '/MakeSurvey', { question: result } );	
	    })
		
	
	
		
		
    }
				
});
//
//  Create Question
//


//
//  Create Answer
//router.post /addAnswer
//
router.post( '/addAnswer', function( req, res, next ) {
console.log('just did a $http.post(/MakeSurvey/addAnswer, person'); 
console.log('the form posted question is req.body ' + JSON.stringify(req.body ) );

console.log('the form posted answerText is req.body.answerText ' + JSON.stringify(req.body.answerText[req.body.questionId] ) );

  req.check( 'answerText', 'An answer is required.' ).notEmpty();

    var errors = req.validationErrors();
	console.log('the server side errors using express-validator are errors..' + JSON.stringify(errors) );
	
    if ( errors ) {
		res.json( '/MakeSurvey', { errors: errors, answerText: {} } );
    } else {
		
		var myAuid = new mongojs.ObjectId();
		console.log('the myAuid is ..' + myAuid);
		
        var newAnswer = {
			  auid: myAuid,
			  answerText: req.body.answerText[req.body.questionId]
        }
        
		
		//var set = {};
        //set['question.answers.'+req.params.answerId+'.answerText']=req.params.answerText; 
	  
		
	  
	   db.questions.findAndModify({query: {"_id": new mongojs.ObjectId(req.body.questionId)}, 
	  update:{$push: {'question.answers':{answerText:req.body.answerText[req.body.questionId], "auid":mongojs.ObjectId(myAuid) } }          }
	  }, function(err, results){
	    console.log('the last item just added to ansers is'
	    )
	    console.log(results);
		console.log('the last item just added to ansers is'
	     )
	  
	   //if want to get the most recent item added to 
	  var last = results.question.answers[results.question.answers.length-1]
        console.log('last added item to array')	 
	    console.log(last);
	    console.log('last added item to array')	

      
	    
	  res.json('/MakeSurvey', {'answer': newAnswer,'err':err }) 
	  
	 
	  
	  
	  })
		
		
		
    }
	
	
	
	
	

} );

//
//  Create Answer
//


//
//  Update Answer
// router.put ( '/updateAnswer/:answerId/:answerText'
//
//router.put( '/updateAnswer/:answerId/:answerText', 
router.put( '/updateAnswer/:questionId/:answerId/:answerText',
function( req, res, next ) {


	console.log('just did a $http.post(/MakeSurvey/updateAnswer, person'); 
    console.log("Received updateAnswer  request...");
	console.log('the id for the answer to be deleted is ...' + req.params);
	console.log('the id for the answer to be deleted is ...' +
	JSON.stringify(req.params));
	
    req.check( 'answerText', 'Answer is required.' ).notEmpty();

    var errors = req.validationErrors();
    if ( errors ) {
        res.json( '/MakeSurvey',{ errors: errors } );
    } else {
      
	  var mystring = "question.answers"+req.params.answerId+".answerText";
	  
	  var set = {};
      set['question.answers.'+req.params.answerId+'.answerText']=req.params.answerText; 
	  
	  
	   db.questions.findAndModify({query: {"_id": new mongojs.ObjectId(req.params.questionId)}, 
	  update:{$set: set}
	  }, function(err, docs){
	  console.log(docs);
	  res.json('/MakeSurvey', {'question': docs,'err':err } );
	  })
	  
	
	  
	
       
	}

} );
//
//  Update Answer
//


//
//  Update Question
//router.put( '/question/:question_id'
//
router.put( '/updateQuestion/:questionId/:questionText', function( req, res, next ) {


	console.log('just did a $http.post(/MakeSurvey/updateQuestion, person'); 
	console.log("Received updateQuestion  request...");
	console.log('the id for the answer to be updated is ...' + req.params);

    req.check( 'questionText', 'Question is required.' ).notEmpty();

    var errors = req.validationErrors();
    if ( errors ) {
         res.json( '/MakeSurvey',{ errors: errors } );
    } else {

       db.questions.findAndModify({query: {"_id": new mongojs.ObjectId(req.params.questionId)}, 
	  update: {$set: {"question.questionText": req.params.questionText}}
	  }, function(err, docs){
	  console.log(docs);
	  res.json('/MakeSurvey', {'question': docs,'err':err 
	  } );
	  })
	   
	   
	   
	   
    }

} );
//
//  Update Question
//




//
//  Delete Answer
// router.delete( '/deleteAnswer/:answerId'
//
router.delete( '/deleteAnswer/:answerId/:questionId', function( req, res, next ) {



	console.log('just did a $http.post(/MakeSurvey/deleteAnswer, person'); 
	console.log("Received deleteAnswer  request...");
	console.log('the id for the answer to be deleted is ...' + req.params);
	console.log('the id for the answer to be deleted is ...' +
	JSON.stringify(req.params));
	
    
	
	req.check( 'answerId', 'Question id is required.' ).notEmpty();

    var errors = req.validationErrors();
    if ( errors ) {
	
	res.json( '/MakeSurvey', { errors: errors } );
    
	} else {
     
	
    
		
	 var set = {};
     
	  
    	 db.questions.findAndModify({query: {"_id": new mongojs.ObjectId(req.params.questionId)}, 
	     update:{$pull: {'question.answers': {'auid':  new mongojs.ObjectId(req.params.answerId)  } }
		 
		 
		 
		 }
	    }, function(err, docs){
	  console.log(docs);
	  res.json('/MakeSurvey', {'question': docs,'err':err } );
	  })
	  
	
		
		
    }

} );

//
//  Delete Answer
//


//
//  Delete Question
//router.delete( '/deleteQuestion/:questionId'
//

router.delete( '/deleteQuestion/:questionId', function( req, res, next ) {

	
	console.log('just did a $http.post(/MakeSurvey/deleteQuestion, person'); 
    console.log("Received deleteAnswer  request...");
	console.log('the id for the answer to be deleted is ...' + req.params);
	console.log('the id for the answer to be deleted is ...' +
	JSON.stringify(req.params));
    
	req.check( 'questionId', 'Question id is required.' ).notEmpty();

    var errors = req.validationErrors();
    if ( errors ) {
		res.json( '/MakeSurvey', { errors: errors } );
    } else {
		
		db.questions.remove({_id: new mongojs.ObjectId(req.params.questionId)}, function(err, results){
		console.log(results);
		
		res.json( '/MakeSurvey', { result: results } );
		
		
	     });
		
		
	
	
	}

} );


//
//  Delete Question
//




//
// Get Survey Data of questions and answers
//router.get( '/SurveyData2', function( req, res, next ) {
//	

router.get( '/SurveyData2', function( req, res, next ) {	

var adminPriv = false;
	sess = req.session;

	//if (sess.knownuser){
		//adminPriv = true;
	//}
	//else{
		//adminPriv = false;
		
	//}

if (sess.loginStatus)	
{
	adminPriv = true;
	
	
	//SurveyData2
	//db.questions.find(function(err, questions){
	
	//res.json( '/SurveyData2', { questions: questions,admin:adminPriv, sessionData:sess,sessKnownUser:sess.knownuser   })
    
	//});
	
	
	
	
	db.questions.find({"question.createdBy":new mongojs.ObjectId(sess.knownuserUserUid)},function(err, questions){
	
	res.json( '/SurveyData2', { questions: questions,admin:adminPriv, sessionData:sess,sessKnownUser:sess.knownuser   })
    
	});
	
	
	
	
}
else {
	adminPriv = false;
	res.json( '/SurveyData2',{admin:false});
}	
	
	
	
   
   
	
	
} );
//
// Get Survey Data of questions and answers
//



//
//  Stats by Question
//router.get( '/question/:question_id/stats', function( req, res, next ) {
//	
router.get( '/SurveyStats/:questionId', function( req, res, next ) {

	console.log('you just requested router.get SurveyStats...' );
	console.log('the req.params.questionId is ...' + req.params.questionId);



	var surveyAnswersUsersMade;
	   
	db.surveyusers.aggregate(
    
    //{ 
	//$group : { _id : "$answerId", total : { $sum : 1 } }
    //},
	{$group: {_id : {answerId : '$answerId',questionId:'$questionId'}, total:{$sum :1}}},
	{
	$sort : {anwerId : -1}
     }, function(err, countofanswers){
	console.log('countofanswers');
	console.log(countofanswers);
	console.log('countofanswers');
     
      res.json( '/MakeSurvey', { SurveyStats: countofanswers } );
	});




} );

//
//  Stats by Question
//	


module.exports = router;