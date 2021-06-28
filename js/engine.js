
/* Store JSON data into companions variable
 * ------------------------------------------------- */

var companions = companions;
//console.log(companions);
//console.log(companions.length);


/* Random number function
 * ------------------------------------------------- */

function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min; 
}

/* First letter array
 * Each row contains the first letter value
 * followed by plants beginning with that letter
 * ------------------------------------------------------- */

function find_letters() {

    // Array of first letters and their plants
    var first = '';
    var letters = new Array();
    
    for ( var i = 0; i < companions.length; i++ ) {
        for ( plant in companions[i] ) {
            var first_letter = plant.charAt(0);
            
    		if ( first_letter != first ) {
    			if ( first != '' ) { j++; } 
    			else { j = 0; }
    			
    			letters[j] = new Array();
    			letters[j].push(first_letter);
    			letters[j].push(plant);

                first = first_letter;
    		} else { letters[j].push(plant); }
        }
    }
    
    return letters;
}



/* Listen for button clicks
 * ------------------------------------------------- */

function empty_results() {

    document.getElementById('result').innerHTML = '';
    document.getElementById('list').innerHTML = '';
    document.getElementById('letters').innerHTML = '';

    document.getElementById('show-menu').classList.toggle('hide');
    document.getElementById('menu').classList.toggle('hide');
}


var menu_btn = document.getElementById('show-menu'); 
var list_btn = document.getElementById('alphabetical'); 
var letter_btn = document.getElementById('letter'); 
var random_btn = document.getElementById('random'); 

menu_btn.onclick = function() { 
    empty_results(); 
}

list_btn.onclick = function() { 
    empty_results(); 
    list(); 
}

letter_btn.onclick = function() { 
    empty_results(); 
    letter(); 
}

random_btn.onclick = function() { 
    empty_results(); 
    random(); 
}


/**
 * -------------------------------------------------------
 * Search list alphabetically
 * An alphabetical list of all the plants
 * ------------------------------------------------------- */

function list() {

    var letters = find_letters();
    var list = new Array();

    list.push('<h1 class="title__search"><span>Search</span> Alphabetical</h1>');
    
    for ( var i = 0; i < letters.length; i++ ) {  
        
        list.push('<article>');
        list.push('<h2 class="title__letter">' + letters[i][0] + '</h2>');
        for ( var j = 1; j < letters[i].length; j++ ) {  
            list.push('<button name="' + letters[i][j] + '">' + letters[i][j] + '</button>');
        }
        list.push('</article>');
    }

    document.getElementById('list').innerHTML = list.join('');
    
    // Listen for the button click on a plant in the list
    var plant_buttons = document.getElementById("list").getElementsByTagName("button");
    for ( let i = 0; i < plant_buttons.length; i++ ) {

        plant_buttons[i].addEventListener("click", function() {
            show_result(companions[i]);
        }, false);
    }
}



/**
 * -------------------------------------------------------
 * Search by first letter
 * List of all first letters, opening up into 
 * plants beginning with that letter
 * ------------------------------------------------------- */

function letter() {

    var letters = find_letters();
    
    var letter_list = new Array();
    letter_list.push('<h1 class="title__search"><span>Search by</span> First letter</h1>');
    
    for ( var i = 0; i < letters.length; i++ ) {
        letter_list.push('<button name="' + letters[i][0] + '">' + letters[i][0] + '</button>');
    }

    document.getElementById('letters').innerHTML = letter_list.join('');


    // Listen for button click of single letter
    var letter_buttons = document.getElementById("letters").getElementsByTagName("button");
    for ( let i = 0; i < letter_buttons.length; i++ ) {

        letter_buttons[i].addEventListener("click", function() {
            
            var list = new Array();
            list.push('<article>');
            list.push('<h2 class="title__letter">' + this.name + '</h2>');

            for ( var j = 1; j < letters[i].length; j++ ) {      
                list.push('<button name="' + letters[i][j] + '">' + letters[i][j] + '</button>');
            }
            list.push('</article>');
            
            document.getElementById('list').innerHTML = list.join('');
            document.getElementById('result').innerHTML = '';
            window.scroll({top: 0, left: 0, behavior: 'smooth'});
            plant_button_click();
        }, false);
    } 
}


function plant_button_click() {
    
    var plant_buttons = '';
    plant_buttons = document.getElementById("list").getElementsByTagName("button");
            
    for ( let i = 0; i < plant_buttons.length; i++ ) {        
        plant_buttons[i].addEventListener("click", function() {

            // Find the position of this.name in the companions array
            for ( var j = 0; j < companions.length; j++ ) {  
                for ( plant in companions[j] ) {
                    if ( plant == this.name ) {
                        show_result(companions[j]);
                    }
                }
            }

        }, false);
    }
}



/**
 * -------------------------------------------------------
 * Search random
 * Randomly pick an entry from the companions array
 * ------------------------------------------------------- */

function random() {

    var random = rand(0, companions.length);
    show_result(companions[random]);
}


/**
 * -------------------------------------------------------
 * Show result
 * ------------------------------------------------------- */

function show_result(chosen) {
	
    var result = new Array();
    var title = new Array('good', 'bad');
    var title_mark = new Array('+', '-');
    
    for ( plant in chosen ) {
        
        result.push('<div class="wrapper">');
        result.push('<h1 class="title__plant">' + plant);
        if ( chosen[plant]['type'] ) {
            result.push('<span>' + chosen[plant]['type'] + '</span>');
        }
        result.push('</h1>');
        result.push('<div class="scrollbar">');
        
        for ( i = 0; i < title.length; i++ ) {
        
            result.push('<article>');
            result.push('<h3>' + title[i] + '</h3>');
            plants = chosen[plant][title_mark[i]];
            
            if ( plants ) {
                result.push('<ul>');
                for ( j = 0; j < plants.length; j++ ) {
                    result.push('<li>' + plants[j] + '</li>');
                }
                result.push('</ul>');
            } else {
                result.push('<p class="none">No ' + title[i] + ' companions</p>');            
            }
            
            result.push('</article>');
        }
        result.push('</div>');
        result.push('</div>');
    }
    
    document.getElementById('result').innerHTML = result.join('');
    window.scroll({top: 0, left: 0, behavior: 'smooth'});
}



























