# Companion plants

## Structure of the JSON file
This is not a real genuine JSON file, but a glorified JavaScript array pretending to be JSON. I have done it this way because it makes it less cumbersome to read the file (kind of).

<pre><code>
var companions = [{
    "Angelica": {
        "+": ["Parsley"], 
        "-": ["Celery"], 
        "type": "Flower" }
    },{
    "Yarrow": {
        "+": ["Raspberry","Rosemary","Sweetcorn"], 
        "-": ["Rue"], 
        "type": "Herb" }
    },
] 
</code></pre>


## Fetching data
Because I chose not to have an extra bit in the data array for "id", the fetching of the individual plant names takes an extra index on the array name (or whatever you call that).

<pre><code>
for ( var i = 0; i < companions.length; i++ ) {  
    for ( plant in companions[i] ) {
        console.log('Plant: ' + plant);
        console.log('Type: ' + companions[i][plant]['type']);
        console.log('Good: ' + companions[i][plant]['+']);
        console.log('Bad: ' + companions[i][plant]['-']);
    }
}
</code></pre>
