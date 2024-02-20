


let gender = { 
	'id': 'gender',
	'text': 'What is your gender?',
	'answer': {
		'type': 'radio',
		'responses': [
			{
				'text': 'M',
				'associate': 'age'
			},
			{
				'text': 'F',
				'associate': 'age'
			}
		]
	}
}

let age = { 
	'id': 'age',
	'text': 'How old are you?',
	'helperText' : 'Sorry, you must be between 40 & 100 to use this app',
	'answer': {
		'type': 'text',
		'associate': 'hypertension'
	},
}

let hypertension = { 
	'id': 'hypertension',
	'text': 'Ever been diagnosed with Hypertension?',
	'answer': {
		'type': 'radio',
		'responses': [
			{
				'text': 'Yes',
				'associate': 'heartDisease'
			},
			{
				'text': 'No',
				'associate': 'heartDisease'
			}
		]
	}
}

let heartDisease = {
	'id': 'heartDisease',
	'text': 'Do you have any heart diseases?',
	'answer': {
		'type': 'radio',
		'responses': [
			{
				'text': 'Yes',
				'associate': 'everMarried'
			},
			{
				'text': 'No',
				'associate': 'everMarried'
			}
		]
	}
}

let everMarried = {
	'id': 'everMarried',
	'text': 'Have you ever been married?',
	'answer': {
		'type': 'radio',
		'responses': [
			{
				'text': 'Yes',
				'associate': 'currentOccupation'
			},
			{
				'text': 'No',
				'associate': 'currentOccupation'
			}
		]
	}
}

let currentOccupation = {
	'id': 'currentOccupation',
	'text': 'What is your current occupation? (Select all that apply)',
	'answer': {
		'type': 'checkbox',
		'responses': [
			{
				'text': 'Self-Employed',
				'associate': 'residenceType'
			},
			{
				'text': 'Public Sector Employee',
				'associate': 'residenceType'
			},
			{
				'text': 'Private Sector Employee',
				'associate': 'residenceType'
			}
		]
	}
}

let residenceType = {
	'id': 'residenceType',
	'text': 'Type of residence?',
	'answer': {
		'type': 'radio',
		'responses': [
			{
				'text': 'Rural',
				'associate': 'glucoseLevel'
			},
			{
				'text': 'Urban',
				'associate': 'glucoseLevel'
			},
		]
	}
}

let glucoseLevel = {
	'id': 'glucoseLevel',
	'text': 'Best Estimate of Blood Glucose Level (mg/mL)?',
	'helperText' : 'Values must be between 0 - 310',
	'answer': {
		'type': 'text',
		'associate': 'bmi'
	},
}

let bmi = {
	'id': 'bmi',
	'text': 'Best Estimate of Body Mass Index (BMI)?',
	'helperText' : 'Values must be between 9 - 73',
	'answer': {
		'type': 'text',
		'associate': 'smokingStatus'
	},
}

let smokingStatus = {
	'id': 'smokingStatus',
	'text': 'What is your current smoking status?',
	'answer': {
		'type': 'checkbox',
		'responses': [
			{
				'text': 'Never Smoked',
			},
			{
				'text': 'Current Smoker',
			},
			{
				'text': 'Former Smoker',
			}
		]
	}
}
let x = null;
var questions = [ gender,everMarried,heartDisease, hypertension, age, smokingStatus, bmi, glucoseLevel, residenceType, currentOccupation];
var toAsk = [ gender ];
var questionResponses = {};
var questionHistory = [];
var record = { 
		'question': '',
		'type': '',
		'added': []
	}
var progress = {
		'answered': 0,
		'minRemaining': 0,
		'maxRemaining': 0,
}
var minRunning = 0;
var maxRunning = 0;

var hue = 0;

//LOGIC

//goes to next question in queue
function nextQuestion(questionID){
	
	//clear object for recording changes.
	record = { 
		'question': '',
		'added': []
	};

	//update progress
	updateProgress();

	if (toAsk.length > 0){
		//if questions remain in queue.
		$('.helperText').html('');

		//get first item in queue
		var question = toAsk[0];
		record.question = question;
		
		var questionHtml = question.text
		let helperText = question.helperText
		
		//formulate answer html
		var answerHtml = '';

		//handle types of answers
		switch (question.answer.type){
			case 'text':
				//output a textarea and next button
				answerHtml += '<textarea class="textarea" name="'+question.id+'"></textarea>';
				answerHtml += '<button class="next round-button" type="button"></button>'

				//create handlers to move forward on next button
				initHandlers = function(){
					$('.next').on('click', function(){
						//save response
						response = $('textarea').val();
						if(question.id ==="age" &&Number(response) < 40 || question.id ==="age" && Number(response) > 100){
							$('.helperText').html(helperText);
							$('.helperText').fadeToggle("slow"); 
							return
						}
						if(question.id ==="bmi" &&Number(response) < 9 ||  question.id ==="bmi" && Number(response) > 74){
							$('.helperText').html(helperText);
							$('.helperText').fadeToggle("slow"); 
							return
						}
						if(question.id ==="glucoseLevel" &&Number(response) < 0 ||  question.id ==="glucoseLevel" &&  Number(response) > 310){
							$('.helperText').html(helperText);
							$('.helperText').fadeToggle("slow"); 
							return
						}
						questionResponses[record.question.id] = response;
						//get id of assicated question and add to queue
						var associate = question.answer.associate;
						addToQueue(associate);
						//record and questions added to the queue
						record.added.push(associate);
						//remove answered question from the queue.
						removeLastAnswered();
						//go to next
						nextQuestion();
					})
					$('.textarea').focus();
				};
			break;
			case 'radio':
				//output a radio and label for each option
				question.answer.responses.forEach(function(response, index){
					
					answerHtml += '<input tabindex="'+(index+1)+'"class="radio active" type="radio" name="'+question.id+'" id="'+response.text+'" value="'+response.text+'" data-associate="'+response.associate+'"/>';
					answerHtml += '<label class="button" for="'+response.text+'">'+response.text+'</label>';

				});

				//create handlers to move forward on selection
				initHandlers = function(){
					$('.radio').on('change', function(){
						//save response
						var response = $(this).val();
						questionResponses[record.question.id] = response;
						//get id of assicated question and add to queue
						var associate = $(this).data('associate');
						addToQueue(associate);
						//record and questions added to the queue
						record.added.push(associate);
						//remove answered question from the queue.
						removeLastAnswered();
						//go to next
						nextQuestion();
					})
				}
			break;
			case 'checkbox':
				//output a checkbox and label for each option and a next button
				question.answer.responses.forEach(function(response){
					answerHtml += '<input class="checkbox" type="checkbox" name="'+question.id+'" id="'+response.text+'" value="'+response.text+'" data-associate="'+response.associate+'"/>';
					answerHtml += '<label class="button" for="'+response.text+'">'+response.text+'</label>';
				});
				answerHtml += '<button class="next round-button" type="button"></button>'
				
				//create handlers to move forward on next button
				initHandlers = function(){
					$('.next').on('click', function(){
						
						var responses = [];
						$('.checkbox').each(function(){
							if($(this).is(':checked')){

								//save responses
								responses.push($(this).val());
								//get associated question and add to queue
								var associate = $(this).data('associate');
								addToQueue(associate);
								//record and questions added to the queue
								record.added.push(associate);
							}
						})
						if(responses.length === 0){
							return;
						}
						questionResponses[record.question.id] = responses;
						//remove answered question from the queue.
						removeLastAnswered();
						//go to next
						nextQuestion();
					})
				};
			break;
			default:
				//set no handlers as default
				initHandlers = function(){};
			break;
		} 
		
		//output to dom
		$('.wrap').addClass('blur')
		setTimeout(function(){
			$('.question').html(questionHtml);
			$('.answer').html(answerHtml);
			initHandlers();
			$('.wrap').removeClass('blur')
			//rotateHue();
		},200)



	} else {
		//if queue is empty
		outputResults();
	}

	//fill in response if it exists in memory
	fillInResponse();

	//show back button
	if (questionHistory.length > 0){
		$('#back').removeClass('blur');
	} else {
		$('#back').addClass('blur');
	}
	

	
}

function removeLastAnswered(){
	removeFromQueue(record.question.id);
	//add a record into the history
	if(record.question !== ''){
		questionHistory.unshift(record);
	}
}

function addToQueue(questionId){
	//find the question object
	var questionIndex = questions.findIndex(function(question){
		return question.id == questionId;
	})
	//if question exists add it to queue
	if (questionIndex >= 0){
		toAsk.unshift(questions[questionIndex]);
	}
}

function removeFromQueue(questionId){
	//find the question in the queue
	var askIndex = toAsk.findIndex(function(question){
		return question.id == questionId;
	})
	if(askIndex >= 0){
		//remove question from queue
		toAsk.splice(askIndex, 1);
	}
}

function goBack(){
	if (questionHistory.length > 0){
		if(x){
			$('#infoDiv').fadeToggle("slow"); 
			$('.center').removeClass('blur');
			x = null;
		}
		//get record of last change
		var record = questionHistory[0];
		//remove all added questions
		record.added.forEach(function(question){
			removeFromQueue(question);
		})
		//add question to front of queue
		addToQueue(record.question.id);
		//remove element from history
		questionHistory.shift(0,1);
		//go to next
		nextQuestion();
		//in case going back from last slide
		$('.remaining').removeClass('blur');
	}
	
}

function fillInResponse(){
	var response = questionResponses[record.question.id];
	if (response != undefined){
		switch(record.question.answer.type){
			case 'text':
				$('.textarea').val(response);
			break;
			case 'checkbox':
				$('.checkbox').each(function(){
					if (response.indexOf($(this).val()) >= 0){
						$(this).attr('checked', true);
					}
				});
			break;
			case 'list':
				response.forEach(function(response, index){
					if (index == 0){
						$('.list').val(response);
					} else {
						$('.add').before('<input class="list" type="text" name="'+record.question.id+'_'+(index+1)+'" value="'+response+'"/>'); 	
					}
				});
			break;
		}
	}
}


function outputResults(){

		$('.wrap').addClass('blur')
		setTimeout(function(){
		
			var congratHtml = '<h2>All done! Please review your answers before submitting.</h2>';
			var reviewHtml = '';
			
			//loop thourgh the history from the back
			for (var r = (questionHistory.length-1); r >= 0; r-- ){
				//output an input prefilled with the value and a label, this way forms submit normally
				var question = questionHistory[r].question;
				var answer = questionResponses[question.id].toString()
				reviewHtml += '<p class="review-left">'+question.text+'</p>';
				reviewHtml += '<input type="text" class="review-right" disabled name="'+question.id+'" value="'+answer+'">';
			}

			reviewHtml += '<input type="submit" class="submit-button" id="confirm" value="Submit"/>';

			//output the html
			$('.question').html(congratHtml);
			$('.answer').html(reviewHtml);

			$('.remaining').addClass('blur');
			$('.wrap').removeClass('blur');

			$('#confirm').on('click', function(event) {
				event.preventDefault(); // Prevent default form submission
				x = 1;
				$('.center').addClass('blur');
				$('#back').addClass('hidden');
				$('.textCenter').removeClass('hidden');
				// Build the backend request URL using the function from the previous response
				const requestUrl = buildBackendRequestUrl(questionResponses);
				// Make the asynchronous request using jQuery.ajax()
				setTimeout(function(){
				$.ajax({
				  url: requestUrl,
				  type: 'GET', 
				  dataType: 'json', // Accept JSON response if expected
				  beforeSend: function() {
					// Show a loading indicator before the request
					
				},
				  success: function(response) {
					// Handle successful response from the backend
					$('.textCenter').addClass('hidden');
					$('#back').removeClass('hidden');
					$('#infoDiv').html(response);
					$('#infoDiv').fadeToggle("slow"); 
				  },
				  error: function(jqXHR, textStatus, errorThrown) {
					$('.textCenter').addClass('hidden');
					// Handle errors during the request
					console.error("Error:", textStatus, errorThrown);
					$("#submitResult").text('Error: ' + errorThrown); 
				  },
				  complete: function() {
					$('.textCenter').addClass('hidden');
					$('#back').removeClass('hidden');
					// Remove the loading indicator after the request finishes
					$("#submitResult").text(''); 
				  }
				});
			}, 1500)
			  });
		}, 200)


}

function updateProgress(){
	//set to basic values
	progress.answered = questionHistory.length;
	progress.minRemaining = 0;
	progress.maxRemaining = 0;

	//init running totals
	minRunning = 100000;
	maxRunning = 0;

	//snake through remaining queue to get max and min
	toAsk.forEach(function(question){
		//recursivley get min max for question
		dig(question.id, 0);
		//add to total and clear running
		progress.minRemaining +=  minRunning;
		progress.maxRemaining +=  maxRunning;
		minRunning = 100000;
		maxRunning = 0;

	})

	if (progress.maxRemaining > progress.minRemaining){
		var remainString = progress.minRemaining + ' - ' + progress.maxRemaining +' Questions Left';
	} else if (progress.minRemaining > 1) {
		var remainString = progress.minRemaining + ' questions to Go';
	} else{
		var remainString = 'Last One!'
	}

	$('.remaining').html(remainString);
}

function dig(questionId, count){
	//check question exists
	var questionIndex = questions.findIndex(function(question){
		return question.id == questionId;
	})
	//if found
	if (questionIndex >= 0){
		//increase question count
		count++;
		var question = questions[questionIndex];
		//check has responses
		if (question.answer.responses){
			//run thruogh all responses
			question.answer.responses.forEach(function(response){
				//check has associated questions
				if(response.associate){
					//recursivley go through assocaited question
					dig(response.associate, count);
				} else {
					//close branch
					setRunningMinMax(count);
				}
			})
		} else {
			//close branch
			setRunningMinMax(count);
		}
	} else {
		//close branch
		setRunningMinMax(count)
	}
}

function buildBackendRequestUrl(data) {
	// Base URL with placeholder for values
	const baseUrl = "http://146.190.53.244:8000/predict/values?";
  
	// Construct query parameters from object data
	const params = [];
	for (const [key, value] of Object.entries(data)) {
	  // Handle single and array values
	  if (Array.isArray(value)) {
		value.forEach(v => params.push(`${key}=${encodeURIComponent(v)}`));
	  } else {
		params.push(`${key}=${encodeURIComponent(value)}`);
	  }
	}
  
	// Join query parameters with separator
	const queryString = params.join("&");
  
	// Combine base URL and query string
	return baseUrl + queryString;
  }
    



function setRunningMinMax(count){
	minRunning = Math.min(minRunning, count);
	maxRunning = Math.max(maxRunning, count);
}

function rotateHue(){
	hue += 1;
	$('body').css('filter', 'hue-rotate('+hue+'deg)');
}

setInterval(rotateHue,2000);

function initialize(){
	//setup back functionality
	$('#back').on('click', goBack);
	$(document).on('keydown', function(e){
		if (e.keyCode == 27)
			goBack();
	})
	$('#start').on('click', function(event) {
	$('.center').removeClass('blur');	
	$('.welcome').addClass('hidden')
	nextQuestion();
	})
	
}


$(document).ready(initialize);

