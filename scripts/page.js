function validateInput ()
{   // validate the data submitted on #train-form

    // for now we'll just assume it was all entered correctly

    return true;
}

function insertTable (data)
{   // Insert the data just received from Firebase into the table #train-schedule

    var newRow = $("<tr>");

    var newName = $("<td>");
    newName.text (data.Name);

    var newDestination = $("<td>");
    newDestination.text (data.Destination);
    
    var newDeparture = $("<td>");
    newDeparture.text (data.Departure);
    
    var newFrequency = $("<td>");
    newFrequency.text (data.Frequency);

    newRow
        .append(newName)
        .append(newDestination)
        .append(newDeparture)
        .append(newFrequency);

    $("#schedule-table")
        .append(newRow);
    
}

$(document).ready(function()
{
    // Initialize Firebase

    var config = {
        apiKey: "AIzaSyCzlKD2uwP2pnMr0M0PYuN4FZhy8fet79g",
        authDomain: "train-schedule-1a059.firebaseapp.com",
        databaseURL: "https://train-schedule-1a059.firebaseio.com",
        projectId: "train-schedule-1a059",
        storageBucket: "train-schedule-1a059.appspot.com",
        messagingSenderId: "641935135454"
    };

    firebase.initializeApp(config);
    
    var database = firebase.database();

    $("#train-submit").on("click", function(event)
    {   event.preventDefault();

        if (validateInput ())
        {   // The data is good...put it into Firebase

            database.ref().push(
            {   Name: $("#train-name").val().trim(),
                Destination: $("#train-dest").val().trim(),
                Departure: $("#train-depart").val().trim(),
                Frequency: $("#train-freq").val().trim()
            })
        }
    });

    database.ref().on("child_added", function(snap)
    {   //  Get data as it is added to the database

console.log(snap.val());
        var Train = snap.val();

        insertTable (Train);
    })
});
