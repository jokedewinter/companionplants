/**
 * -------------------------------------------------------
 * In the beginning ...
 * -------------------------------------------------------
 */

$(document).ready(function() {
	build_lists();
	sessionStorage.chosen_search = ''; // Start with an empty chosen search
	
	// Divert search choice to search method
	$('#search_method ul li a').click(function(e){
		e.preventDefault();

		// If there is already a saved chosen_search, move it to previous_search
		chosen_search = sessionStorage.chosen_search;
		previous_search = chosen_search;

    	var chosen_search = $(this).attr('href');
    	var chosen_search = chosen_search.substring(1, chosen_search.length);
		sessionStorage.chosen_search = chosen_search;

		// If it's a different choice from the previous value,
		// remove the previous search method and result
		if ( chosen_search != previous_search ) {
			$('#' + previous_search).css('display', 'none'); 
			$('#search_result').css('display', 'none'); 
		}
		window.scrollTo(0,0);
		search_method[chosen_search](); // Go to the chosen_search method function
  	});
});

// A bunch of variables used all over the place
var plants = Array();	// All the plants with good/bad companions in nested array
var types = Array(); 	// All the plant types. For each type all the plants that belong to it
var letters = Array(); 	// All the different first letters. For each letter all the plants that begin with it

// A variable to help calling the chosen search method
// http://stackoverflow.com/questions/8588307/calling-a-jquery-function-named-in-a-variable
var search_method = {
	'search_list': search_list,
	'search_letter': search_letter,
	'search_name': search_name,
	'search_random': search_random,	
}

/**
 * -------------------------------------------------------
 * Kick off the session and read the json file
 * Do this bit only once, at the beginning of a session
 * URL: http://stackoverflow.com/questions/25070877/jquery-run-once-per-session
 * URL: http://runnable.com/UhY_jE3QH-IlAAAP/how-to-parse-a-json-file-using-jquery
 * -------------------------------------------------------
 */

function build_lists() {
	if ( !sessionStorage.get_ready ) {
		sessionStorage.get_ready = "true";
		
		// Read the companion plant file and process the data into arrays
		$.ajax({
			url: "files/companions.json",
			dataType: "text", // Force to handle the file as text

			success: function(data) {
				var json = $.parseJSON(data); // All the data is put in the json variable
				create_plants_array(json);
				create_letters_array(json);
				//create_types_array(json);								
			},

			error: function(request, status, error) {
				output = '<p>Something went wrong with reading the database file: <em>' + error + '</em></p>';
				$('#update').html(output);
			}
		});		
	}
}

/**
 * -------------------------------------------------------
 * Create the plants array
 * This is a multi dimensional array containing all the plants and their good and bad companions.
 * sessionStorage: http://stackoverflow.com/questions/11609376/passing-data-between-html-pages
 *
 * TODO: 
 * Add the plant type to this as well
 * -------------------------------------------------------
 */

function create_plants_array(json) {
	
	var i = 0;
	$.each(json, function(key, val) {
		
		plants[i] = new Array();
		plants[i][0] = key; // The plant name
		plants[i][1] = new Array(); // The good companions
		plants[i][2] = new Array(); // The bad companions
		// plants[i][3] = val.type;

		// Only stick the good/bad companions in the array if there are any
		if ( val.good) { plants[i][1] = val.good; }
		if ( val.bad ) { plants[i][2] = val.bad; }

		i++;
	});
	
	// Stick this in sessionStorage
	sessionStorage.plants = JSON.stringify(plants); //will set object to the stringified myObject
	var session_plants = JSON.parse(sessionStorage.plants); //will parse JSON string back to object
}

/**
 * -------------------------------------------------------
 * Create the letters array
 * This is a multi dimensional array containing all the different first letters 
 * and the plants beginning with that letter
 * -------------------------------------------------------
 */

function create_letters_array(json) {

	var first = '';
	$.each(json, function(key) {

		var first_letter = key.charAt(0);
		if ( first_letter != first ) {
			// Only start adding to i after the first ever letter is done with
			// If it is the first ever letter, then it seems to want to be initialised here, 
			// rather than before the $.each statement
			if ( first != '' ) { i++; } 
			else { i = 0; }
			
			letters[i] = new Array();
			letters[i].push(first_letter);
			letters[i].push(key);
			first = first_letter; // Update first value

		} else { letters[i].push(key); }
	});

	sessionStorage.letters = JSON.stringify(letters);
	var session_letters = JSON.parse(sessionStorage.letters);
}

/**
 * -------------------------------------------------------
 * Search list
 * An alphabetical list of all the plants
 * -------------------------------------------------------
 */

function search_list() {
	
	$('#search_list').css('display', 'block'); 

	// Take the plants array and show the list of plants
	var session_plants = JSON.parse(sessionStorage.plants);
	var total_plants = session_plants.length;
	var plants_list = '';
	
	for ( var i = 0; i < total_plants; i++ ) {	
		plants_list += '<li>';
		plants_list += '<a href="#' + session_plants[i][0] + '">';
		plants_list += session_plants[i][0];
		plants_list += '</a>';
		plants_list += '</li>';
	}

	$('#search_list ul').html(plants_list); // replace all existing content
	$('#search_list ul li a').click(function(e){
		e.preventDefault();
    	var chosen_plant = $(this).attr('href');
    	var chosen_plant = chosen_plant.substring(1, chosen_plant.length);
		show_result(chosen_plant); // Go to the results section
	});
}

/**
 * -------------------------------------------------------
 * Search by first letter
 * If a letter is clicked you need to show all the plants beginning with that letter
 * -------------------------------------------------------
 */

function search_letter() {

	$('#search_letter').css('display', 'block'); 

	// Take the letters array and show the list of letters
	var session_letters = JSON.parse(sessionStorage.letters);
	var total_plants = session_letters.length;
	var letters_list = '';
	
	for ( var i = 0; i < total_plants; i++ ) {	
		letters_list += '<li>';
		letters_list += '<a href="#' + session_letters[i][0] + '">';
		letters_list += session_letters[i][0];
		letters_list += '</a>';
		letters_list += '</li>';
	}

	$('#search_letter ul#letters').html(letters_list); // replace all existing content
	$('#search_letter ul li a').click(function(e){
		e.preventDefault();
    	var chosen_letter = $(this).attr('href');
    	var chosen_letter = chosen_letter.substring(1, chosen_letter.length);
    	
    	// Find this letter in the letters array and store the plants
		for ( var i = 0; i < total_plants; i++ ) {
			if ( session_letters[i][0] == chosen_letter ) {	
				var letter_plants = session_letters[i];
				break;
			}
		}
   
 		// Clear out any previous letter results
		$('#search_letter-plants h3').remove();
		$('#search_letter-plants ul').remove();
	
		// Display the letter and the plants
		$('#search_letter-plants').append('<h3>' + letter_plants[0] + '</h3>');	
		$('#search_letter-plants').append('<ul class="columns"></ul>');

		for ( var i = 1; i < letter_plants.length; i++ ) {	
			var letter_list = '';
			letter_list += '<li>';
			letter_list += '<a href="#' + letter_plants[i] + '">';
			letter_list += letter_plants[i];
			letter_list += '</a>';
			letter_list += '</li>';
			$('#search_letter-plants ul').append(letter_list);
		}

		// Go to the next search query to chose a plant beginning with this letter
		// You need a different function so that all the button clicks can be logged in
		// their own function. Keeps all the buttons as clickable.
		search_letter_plants();
	});
}

/**
 * -------------------------------------------------------
 * Search by first letter - the actual plants
 * -------------------------------------------------------
 */

function search_letter_plants() {

	// If a plant is clicked you need to go to the results section
	$('#search_letter-plants ul li a').click(function(e){
		e.preventDefault();
		console.log('click');
    	var chosen_plant = $(this).attr('href');
    	var chosen_plant = chosen_plant.substring(1, chosen_plant.length);
		console.log(chosen_plant);
		show_result(chosen_plant); // Go to the results section
	});	
}

/**
 * -------------------------------------------------------
 * Search by name
 * SOURCE: https://github.com/albburtsev/jquery.lookingfor/
 * This piece of nifty code I found works by using a list underneath the input field.
 * The list is populated with every possible item you can search for.
 * An as something is typed in the input box, the list will shrink to only show what matches
 * -------------------------------------------------------
 */

function search_name() {

	$('#search_name').css('display', 'block'); 
	$('#plant_name').focus();
	
	// Prepare for the search by filling up the lookingfor list underneath the input field
	var session_plants = JSON.parse(sessionStorage.plants); 
	var total_plants = session_plants.length;
	/*
	for ( var i = 0; i < total_plants; i++ ) {		
		$('#lookingfor').append('<li>' + session_plants[i][0] + '</li>');
	}

	$('#lookingfor').lookingfor({
		input: $('input[name="plant_name"]'),
		items: 'li',
		highlight: true,
		highlightColor: 'peru'
	});
	*/
	$('#ask_plant_name').submit(function(e) {
		e.preventDefault();
		$('#not_found').empty(); // Clear out the error field.
		var plant_name = $(this).serializeArray();
		plant_name = plant_name[0].value;
		
		// The plants array is case sensitive. The input might not be sensitive.
		// Convert the whole lot to lowercase first.
		// Then captilize the first letter of each separate word.
		// Then proceed.
		plant_name = plant_name.toLowerCase();
		plant_name_split = plant_name.split(' '); // Splits it up into separte words (if there are any)
		for ( var i = 0; i < plant_name_split.length; i++ ) { // Capitalise each word
			plant_name_split[i] = plant_name_split[i].charAt(0).toUpperCase() + plant_name_split[i].substring(1);
		}
		plant_name = plant_name_split.join(" "); // Put it back together
		
		// Make a quick check to see if this plant features in the plants_array
		var itis = false;
		var session_plants = JSON.parse(sessionStorage.plants);
		var total_plants = session_plants.length;

		for ( var i = 0; i < total_plants; i++ ) {
			if ( session_plants[i][0] == plant_name ) {	
				show_result(plant_name);
				itis = true;
				break;
			}
		}

		// Clear the input field and give an error message in case the requested plant wasn't found
		if ( itis == true ) { $('#ask_plant_name')[0].reset(); } 
		else {
			// It doesn't feature in the array
			$('#ask_plant_name')[0].reset();
			$('#not_found').empty();
			$('#not_found').html('Sorry. <strong>' + plant_name + '</strong> is not in the list of plants.');
		}		
	});
}

/**
 * -------------------------------------------------------
 * Search random
 * Randomly pick an entry from the array
 * The result of the random thing is an array.
 * The first element is the random plant to display the results for
 * -------------------------------------------------------
 */
 
function search_random() {

	$('#search_random').css('display', 'block'); 
	var session_plants = JSON.parse(sessionStorage.plants); 
	var plant_random = session_plants[Math.floor(Math.random() * session_plants.length)];	
	show_result(plant_random[0]);
}

/**
 * -------------------------------------------------------
 * Show result
 * -------------------------------------------------------
 */

function show_result(chosen_plant) {
		
	$('#search_result').css('display', 'block'); 

	// Find the companions of the chosen_plant
	var session_plants = JSON.parse(sessionStorage.plants);
	var total_plants = session_plants.length;

	for ( var i = 0; i < total_plants; i++ ) {
		if ( session_plants[i][0] == chosen_plant ) {	
			var good_companions = session_plants[i][1];
			var bad_companions = session_plants[i][2];
			break;
		}
	}
	
	// Clear out any previous results
	$('#search_result #like ul').remove();
	$('#search_result #like p').remove();
	$('#search_result #dislike ul').remove();
	$('#search_result #dislike p').remove();
	
	// Display the results
	$('#search_result h2').html(chosen_plant);
	
	if ( good_companions != '' ) { // It has likes
		$('#search_result #like').append('<ul class="columns"></ul>');
		for ( var i = 0; i < good_companions.length; i++ ) {
			$('#search_result #like ul').append('<li>' + good_companions[i] + '</li>');
		}
	} else { $('#search_result #like').append('<p>Loves nothing.</p>'); }
	
	if ( bad_companions != '' ) { // It has dislikes
		$('#search_result #dislike').append('<ul class="columns"></ul>');
		for ( var i = 0; i < bad_companions.length; i++ ) {
			$('#search_result #dislike ul').append('<li>' + bad_companions[i] + '</li>');
		}
	} else { $('#search_result #dislike').append('<p>Loves everything!</p>'); }
	
	window.scrollTo(0,0);
}