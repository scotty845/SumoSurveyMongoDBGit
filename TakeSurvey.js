
var express = require( 'express' );

//var models = require( './models' );

//mongodb conection using mongojs
var mongojs = require('mongojs');
var db = mongojs('sumosurveydb', ['questions','surveyusers']);


var util = require( 'util' );
var _ = require( 'underscore' );
var q = require( 'q' );

var router = express.Router();
var app = express();



//
//Get a list of question ids that the ip address is associated with
//

function getQuestionIdsGuestHasSeen( ipaddress ) {
    console.log('the ip address is..' + ipaddress);
	
	var defered = q.defer();
    var surveyAnswersUsersSeen;
	
	
	db.surveyusers.find({"guestIP":String(ipaddress)}, 
	   function(err, surveyAnswersUsersSeen){
  
	   var ids = _.pluck( surveyAnswersUsersSeen, 'questionId' );
	   defered.resolve( ids );

	    })
	
       return defered.promise;
}
//
//Get a list of question ids that the ip address is associated with
//


//
//  Get a list of valid question ids from the database;
//
function getListOfValidQuestionIds( filterIds ) {
	
	console.log('the filterIDS is..');
		console.log(filterIds);
	console.log('the filterIDS is..');
	
    var defered = q.defer();

    var filterIds = filterIds || [];

	db.questions.find(function(err, questions){
	 
	 var ids = _.pluck( questions, '_id' );
     //var validIds = _.difference( ids, filterIds );
     
	 var validIds =  _.filter(ids, function(obj){ return !_.findWhere(filterIds, obj); });
	 
		console.log('the ids in getListOfValidQuestionIds( filterIds' );
		console.log(ids);
		console.log('the ids in getListOfValidQuestionIds( filterIds' );


		console.log('the validIds in getListOfValidQuestionIds( filterIds' );
		console.log(validIds);
		console.log('the validIds in getListOfValidQuestionIds( filterIds' );	 
	 
	 
		defered.resolve( validIds );

	
	
	})
	
	
   

    return defered.promise;
}

//
//  Get a list of valid question ids from the database;
//


//	
//  Pull a random id from the list provided
//
function randomlySelectQuestionId( ids ) {
	//console.log('the ids in randomlySelectQuestionId' );
		//console.log(ids);
	//console.log('the ids in randomlySelectQuestionId' );
	
    var randomIndex = _.random( 0, ids.length-1 );
    return ids[ randomIndex ];
}
//	
//  Pull a random id from the list provided
//




//
//  saveSurveyAnswer
// router.post( '/saveSurveyAnswer'
//
router.post( '/saveSurveyAnswer', function ( req, res, next ) {
	
	
	console.log('router.get /addSurveyAnswer inside TakeySurvey'  );
	
	console.log("Received add one survey answer request...");
	console.log(req.body);
	var mySurveyAnswer = req.body.answer;
	//var mySurveyQuestion = req.body.question;
	//console.log(mySurveyQuestion);
	
	//var myAnswerText = mySurveyAnswer.answerText;
	//console.log('myAnswerText is...' + myAnswerText);
	var jsonStringAnswer = mySurveyAnswer;
    var jsonObjAnswer = JSON.parse(jsonStringAnswer);
	var mySurveyAnswerText =jsonObjAnswer.answerText;
	var mySurveyAnswerId =jsonObjAnswer.auid;
	var mySurveyQuestionId = req.body.question;
	//var jsonStringQuestion = mySurveyQuestion;
	//var jsonObjQuestion = JSON.parse(jsonStringQuestion);
	//var mySurveyQuestionId =jsonObjQuestion.question;
	var myRealIpAddress = req.ip; // a test number'::20'
    //console.log(jsonObj.answerText);
	console.log(' mySurveyAnswerText ..' +  mySurveyAnswerText );
	console.log(' mySurveyAnswerId ..' +  mySurveyAnswerId );
	
	console.log(' mySurveyQuestionId ..' +  mySurveyQuestionId );
	console.log(' myRealIpAddress ..' +  myRealIpAddress );
	
	//var questionId = req.body.question;
    //var answerId = req.body.auid;
    var guestIP = req.ip;
    //
    
	// Allow developer to mock IPs for testing.
    // 

    //process.env.RANDOM_IP = '::20';	
   // if( process.env.RANDOM_IP ) {
     //   guestIP = process.env.RANDOM_IP;
   // }
    // 
    // Allow developer to mock IPs for testing.
    //  
	
	 //if invalid question //
    if( !mySurveyQuestionId || mySurveyQuestionId.length === 0 ) {
        var err = new Error( 'Invalid question id.' );
        throw err;
        return;
    }

	//if user was able to post without choosing an answer //
    if( !mySurveyAnswerId || mySurveyAnswerId.length === 0 ) {
        var errors = [
            { msg: 'Please choose an answer and try again.' }
        ];
		
		//since user was able to post with out choosing an answerId
		//find question that corresponds to users survey question
		// and pull the respective answers
		//send them back to /TakeSurvey to answer same question again
       // models.Question.find( { 
         //   where: { id: mySurveyQuestionId },
           // include: [{ model: models.Answer }] 
        //} ).then( function( question ) {
          //  res.json( '/TakeSurvey', { question: question, errors: errors } );
        //});
    } else {     
         //user properly chose an answer
		//create and entry in SurveyAnswer table
		
		    var myCreatedate = new Date().toISOString()
	    
		
	var newSurveyUser = {    
      'guestIP': String(myRealIpAddress),
      "createDate" : myCreatedate,
      "updateDate" : myCreatedate,
      "questionId" : mongojs.ObjectId(mySurveyQuestionId),
      "answerId"   : mongojs.ObjectId(mySurveyAnswerId)
	   }	
	
	  db.surveyusers.insert(newSurveyUser, function(err,result){
		//console.log(docs);
		//res.json(docs);
		console.log("Record added as "+result);
		res.json( '/TakeSurvey', { newSurveyUser: result,errors:err } );	
	    })
		
		
    
	
	}
} );

//
//  saveSurveyAnswer
//





//
// get survey data 
//router.get('/survey'
// 	
router.get('/survey', function(req, res){
	 
	console.log('router.get /survey inside TakeySurvey'  );
	
	
	var ipaddress = req.ip;
		
	//set for test	
    // process.env.RANDOM_IP = '::1';
	
    // Allow developer to mock IPs for testing.
    // ************************************** **************************************
    if( process.env.RANDOM_IP ) {
        ipaddress = process.env.RANDOM_IP;
    }
    // ************************************** **************************************
    
	console.log('the ipaddress is ...' + ipaddress);
	
	
    //
    //  get survey data of questions user has not answered
    //
   //var myAlreadySeenQuestions = getQuestionIdsGuestHasSeen(ipaddress);
   
   
   //getListOfValidQuestionIds(myAlreadySeenQuestions);

   //models.Question.findAll().then(
       // function( questions ) {
         //   if( questions.length === 0 ) {
			//	console.log('...if( questions.length === 0 ) {....')
                //
                //  No survey questions yet  
               
            //} else {
				//console.log('...else theres some questions in the database that the user has not answered...')
                q.fcall( function() { return ipaddress; } )
                //
                //  Get a list of question ids the guest ip has seen
                //
                .then( getQuestionIdsGuestHasSeen )
                //
                //  Filter out the question ids the guest has seen already
                //
                .then( getListOfValidQuestionIds )
                //
                //  Randomly pick a question out of the filtered ids
                //
                .then( randomlySelectQuestionId )
                //
                //  Present the question to the user
                //
                .then( function( questionId ) {
                  //  if( !questionId ) {
               // 	res.json('/TakeSurvey',{ question:null,errors: null });	
                //    } else {
					
	  var surveyAnswerUNSR;				
      db.questions.find({"_id":new mongojs.ObjectId(questionId)}, 
      function(err, surveyAnswerUNSR){

	   res.json('/TakeSurvey',{ question:surveyAnswerUNSR,errors: err });	
				
	  })
					
					
					
					
                  //      models.Question.find( { 
                    //        where: { id: questionId },
                      //      include: [{ model: models.Answer}] ,
							
                      //  } ).then( function( question ) {
                            
					//		if(question.Answers.length >1) {
				//			res.json('/TakeSurvey',{ question:question,errors: null });	
					//		}
						//	else{
								
						//	res.json('/TakeSurvey',{ question:null,errors: null });	
							
							//}
						
						
						
						//});
                    //}
                //});

           // }
        }
    ).catch( function( error ) {
       
    });

     

/*
	 db.questions.find(function(err, questions){
	
   var myRandomRecord =randomlySelectQuestionId(questions) 
	console.log('the myRandomId is...' + JSON.stringify(myRandomRecord ) );
	
	console.log('the questions are..');
	console.log(questions);
	
	//res.json( '/SurveyData2', { questions: questions,admin:adminPriv, sessionData:sess,sessKnownUser:sess.knownuser   })
	 res.json('/TakeSurvey',{ question:myRandomRecord,errors: null });	

});
   
*/   
   
   
   
   
	
});	
//
// get survey data of questions user has not answered
//router.get('/survey'
// 	




module.exports = router;