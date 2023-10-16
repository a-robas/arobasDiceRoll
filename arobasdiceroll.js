// Will only load if we're on an answer page
if(window.location.href.indexOf('/post') > -1) {


  // messages
  var messagesConst = {
  	"rollDiceButton" : {"fr":"Lancer un dé", "en":""},
  	"warningDisplay" : {"fr": "Attention : 1) Le message sera posté avec votre compte.<br/>2) Vous ne pourrez pas l'éditer une fois posté.<br/><br/>"},
  	"warningNoEdit" : {"fr": "Attention : vous ne pourrez plus éditer ce post une fois posté !"},
  	"confirmNoEdit" :  {"fr": "Attention : vous ne pourrez plus éditer ce post une fois posté. Voulez-vous poster ? "},
  	"confirmPosting" :  {"fr": "Post en cours, merci de patienter..."},
  	"errorChooseDice" :  {"fr": "Merci de choisir un dé."},
  	"cancelRoll" : {"fr": "Annuler le lancer"},
  	"chooseDice": {"fr": "Choisir un dé"},
  	"rollDice": {"fr": "Lancer&Poster"},
  };

   // Language to display the roll in
   const lang = "fr";

  // If a confirmation message is needed
  const confirmPosting = true;


  // Where to display the button
  const displayButton = "SUBMIT"; // TOP or SUBMIT, SUBMIT default
  

  // Css classes
  const cssClasses = {
  	'warning': 'wcdr',
  	'error': 'ecdr',
  	'info': 'icdr',
  	'errorSelectDice': 'esdr'
  };

  // Dice declaration
  var diceArray = [
  {
  	diceName: "Dé Oui/Non",
  	sides: 2,

        // Optionnal: if a side label is missing, or there are no sideLabel attribute, the side will automatically take the side name
        sidesLabels: ['Oui', 'Non'], 

        // Optionnal : if no weightArray or no weight, weight = false
        weight: false
    },
    {
    	diceName: "Dé 6sides cheaté",
    	sides: 6,
    	sidesLabels: ['50%'],
    	weight: true,

        // Optionnal : if weightArray is not filled out entirely for the array, all missing weights are 1 - sum of weights
        weightArray: [0.5]
    },
    {
    	diceName: "Dé 6sides sans label",
    	sides: 6,
    	sidesLabels: [],
    	weight: false,
    },
    {
    	diceName: "Dé 20 sans label",
    	sides: 20,
    	sidesLabels: [],
    	weight: false,
    },
    {
    	diceName: "Dé 10 12 pondérations",
    	sides: 10,
    	sidesLabels: [],
    	weight: true,
    	weightArray: [0.2,0.4,0.5,0.1,0.1,0.6,0.7,0.8,0.1,0.1,0.1,0.1]
    },
    ];

    var lastRoll = "";

  // Functions

  function rollCustomDice(sides = 1, weightFlag = false, weightSides= [], labelSides = []) 
  {
  	var generatedNumber = -1;
  	var generatedLabel = "";

      // If the dice has the same chances for all sides
      if(!weightFlag) {

        // Let's calculate the probability for each side
        for(i = 0 ; i < sides ; i++) {
        	weightSides[i] = parseFloat((1/sides).toFixed(2));
        }
    } else {

        // Check we have the same number of probabilites as we have of sides for our dice
        if(weightSides.length != sides) {

        	var emptyIndexes = [];
        	var sumWeight = 0;
        	var emptyWeights = 0;

          // IF more
          if(weightSides.length > sides) {

            // Remove the extra ones
            weightSides.splice(sides, (weightSides.length-sides));
        }
        
          // Otherwise, we count how much are missing
          for(i = 0 ; i < sides ; i++) {

          	if(weightSides[i] == "" || weightSides[i] === undefined) {
          		emptyIndexes.push(i);
          	} else {
          		sumWeight += weightSides;             
          	}
          }

          // Then calculate
          emptyWeights =  ((1 - sumWeight) / emptyIndexes.length).toFixed(2);

          // Fill in the blanks
          emptyIndexes.forEach(function(indexARemplir) {
          	weightSides[indexARemplir] = parseFloat(emptyWeights);
          });
      }
  }

      // Dice is ready: we roll
      var roll = Math.random();
      var sumWeightRoll = 0;
      for (var i = 0; i < weightSides.length; i++) {
      	sumWeightRoll += parseFloat(weightSides[i]);
      	if (roll < parseFloat(sumWeightRoll)) {
      		generatedNumber = i;
      		break;
      	}
      }

      if(generatedNumber == -1) {
      	generatedNumber = weightSides.length - 1;
      }
        // We take the label if we have one
        if(labelSides[generatedNumber] == undefined) {
        	generatedLabel = generatedNumber;
        } else {
        	generatedLabel = labelSides[generatedNumber];
        }

        // Return the label
        return generatedLabel;
    }

    function showPostingArea()
    {

    // We hide the roll area if the user wants to type
    $('form h1, form .panel.row2').show();

    // re-add the box

    $('#postingbox').prependTo($('form[action="/post"] .inner:first'));
    $('#postingbox .inner fieldset #message-box #textarea_content textarea').removeClass('textarea_rolldice').removeAttr("placeholder");

    $('#postingbox .inner .h3, #postingbox .inner dl').show();
    

    // removes a nice warning message + a cancel button
    $('.'+cssClasses['warning']+', #rollForm').remove();


    // Shows the roll button
    $('#customDiceRoll').show();
}


function hidePostingArea()
{
	
    // Hides a nice warning message + a cancel button
    $('form[action="/post"').before(`<div class="${cssClasses['warning']}">${messagesConst["warningDisplay"][lang]} <a id="cancelCustom">${messagesConst["cancelRoll"][lang]}</div>`);
    $('#cancelCustom').off('click').on('click', showPostingArea);


    // We hide the posting area if the user wants to roll a dice
    $('form h1, form .panel.row2').hide();

    // Hides the roll button
    $('#customDiceRoll').hide();
}

function showRollArea()
{
    // Insert the area
    $('.'+cssClasses['warning']).before(`<div id="rollForm"><select id="selectDice"><option value="">${messagesConst["chooseDice"][lang]}</option></select>
    	<button id="rollDice" class="button1">${messagesConst["rollDice"][lang]}</button></div>`);
		
    // Insert the textbox    
    $('#postingbox').prependTo($('#rollForm'));
    $('#postingbox .inner fieldset #message-box #textarea_content textarea').attr('class', 'textarea_rolldice').attr('placeholder',messagesConst["warningNoEdit"][lang]);
   
    $('#postingbox .inner .h3, #postingbox .inner dl').hide();
    $('#postingbox .inner .h3, #postingbox .inner dl:first').show();
   
    // Filling out the select
    diceArray.forEach(function(dice,i) {
    	$('#selectDice').append("<option value="+i+">"+dice["diceName"]+"</option>");
    });

    // Listeners
    $('#rollDice').on('click', function(){

    	$('.'+cssClasses['error']).remove();
    	if($('#selectDice').val() != "") {
    		$('#selectDice').removeClass(cssClasses['errorSelectDice']);

          // Get the selected dice
          var selectedDice = diceArray[$('#selectDice').val()];

          // roll
          var roll = rollCustomDice(selectedDice['sides'], selectedDice['weight'], selectedDice['weightArray'], selectedDice['sidesLabels']); 

      } else {
      	$('#selectDice').addClass(cssClasses['errorSelectDice']);
      	$('#postingbox').after(`<div class="${cssClasses['error']}">${messagesConst["errorChooseDice"][lang]}</div>`);

      }

        // Then, you fill out the textarea
        $('#textarea_content textarea').before("<div id='dumpLoad'></div>");
        $('#dumpLoad').load('https://arobasprophet.forumactif.com/h1-rollpost', (response, status) => {
        	$('#dumpLoad').remove();
        	
        	response = response.replace('#DICENAME#', selectedDice['diceName']).replace('#RESULTROLL#',roll);
        	$('#textarea_content textarea').val($('#textarea_content textarea[name!="message"]').val()+"<br/><br/>"+response);
        	
            // Sends it
            if(confirmPosting) {
            	var confirmPost = confirm(messagesConst["confirmNoEdit"][lang]);
            } else {
            	confirmPost = true;
            }
            if(confirmPost) {
            	$('#rollForm').before(`<div class="${cssClasses['info']}">${messagesConst["confirmPosting"][lang]}</div>`);
            	$('.'+cssClasses['warning']+', #rollForm').hide();

               // put back the textarea where it should be
               $('#postingbox').prependTo($('form[action="/post"] .inner:first'));
               $('.submit-buttons .button1').click();
           }
       });
        return false;
    });
}

  // Contains the html
  var htmlAnswer = "";
  $(document).ready(function() {

		// If I detect the html in the response, I delete the val
		if($('#textarea_content textarea').val().indexOf('resultCustomRoll') > - 1) {
			$('#textarea_content textarea').val("");
		}
		
	 // Add roll button to top or submit
	 if(displayButton == "TOP") {
	 	$('form[action="/post"]').before(`<a id='customDiceRoll' class='button2'>${messagesConst["rollDiceButton"][lang]}</a>`); 
	 } else if(displayButton == "SUBMIT") {
	 	$('.submit-buttons').prepend(`<a id='customDiceRoll' class='button2' style="margin-right:25px;">${messagesConst["rollDiceButton"][lang]}</a>`); 
	 }

      // Listeners
      $('#customDiceRoll').on('click', hidePostingArea);
      $('#customDiceRoll').on('click', showRollArea); 

  });
} else if(window.location.href.indexOf('/t') > -1) {
  // If I am on a topic, I want to target the noedit posts and make them uneditable if I'm not an admin
  $(document).ready(function() {

  	
  	if(_userdata['user_level'] != 1) {
  		
      // Targets all noedit
      $('.noedit').each(function() {
      	console.log($(this));
          // 1st: remove the class
          $(this).removeClass('noedit');

          //2nd: gets the edit button
          $($(this).parents()[3]).children('.post-head').find('.menu-wrap .profile-icons .btn-edit').remove();
      });
  }
});
}