var Trains = [];                // An array of objects representing all of the scheduled trains

function validateInput ()
{   // validate the data submitted on #train-form

    // If #error-div exists -- remove it
    $("#error-div").remove();

    var errorDiv = $("<div>");
    errorDiv.attr("id", "error-div");

    var formDiv = $("#form");
    formDiv
        .append (errorDiv);
    var errors = false;

    if ($("#train-name").val().trim() === "")
    {   var errorP = $("<div>");
        errorP.text ("Train name is required");
        errorDiv.append(errorP);
        errors = true;
    }

    if ($("#train-dest").val().trim() === "")
    {   var errorP = $("<div>");
        errorP.text ("Destination is required");
        errorDiv.append(errorP);
        errors = true;
    }

    var departure = $("#train-depart").val().trim();

    if (departure === "")
    {   var errorP = $("<div>");
        errorP.text ("Departure time is required");
        errorDiv.append(errorP);
        errors = true;
    }
    else
    {   // The <input> on my input form is type=time, which should make the following code unnecessary.
        // But Mozilla says support for type=time is spotty and can't be counted on.  They specifically
        // call out Apple's Safari which degrades to type=text -- which could make this code useful
        // after all.

        var formatErr = false;

        if (departure.length != 5)
            formatErr = true;
        else
        {   var timeBits = departure.split(":");
            if (timeBits === departure)
                formatErr = true;
            else
            if ((timeBits[0] < 0) || (timeBits[0] > 23))
                formatErr = true;
            else
            if ((timeBits[1] < 0) || (timeBits[1] > 59))
                formatErr = true;
        }

        if (formatErr)
        {   var errorP = $("<div>");
            errorP.text ("Please enter Departure Time in 24 hour (military) format");
            errorDiv.append(errorP);
            errors = true;
        }
    }

    if ($("#train-freq").val().trim() === "")
    {   var errorP = $("<div>");
        errorP.text ("Frequency is required");
        errorDiv.append(errorP);
        errors = true;
    }

    if (errors) return false;
    return true;
}

function lastDeparture (d, freq)
{   // Get the time (in 24-hour format) from the data. kind of, almost.  I actually want the most
    // recent departure time, no matter what the first was.  Returns a moment object representing
    // the most recent departure.

    // get a moment object representing the first time of departure
    var fDepart = moment(d, "YYYY/MM/DD HH:mm");

    // and calculate how many time the train run since then
    var delta = moment().diff(fDepart, "minutes");

    // If delta is negative, the train hasn't started running yet.  Return the input time
    if (delta < 0)
        return fDepart;

    // Other wise the most recent departing time is the first departing time + the number of times
    // the train has made its run * the number of minutes to each run.
    var numRuns = Math.floor(delta / freq);

    // and add these minutes to the first departure time.  This is the time of the LAST
    // departure
    var lDepart = fDepart.add(freq * numRuns, "minutes");

    return lDepart;
}

function getETA (departing, freq)
{   // Calculate the ETA and "minutes away" from the most recent departure time and the minutes per
    // run.  Returns a moment object representing the ETA

    return departing.add(freq, "minutes");
}

function insertTable (data)
{   // Insert the data just received from Firebase into the table #train-schedule

    var newRow = $("<tr>");

    var newName = $("<td>");
    newName.text (data.Name);

    var newDestination = $("<td>");
    newDestination.text (data.Destination);
    
    var departing = lastDeparture(data.Departure, data.Frequency);

    var newDeparture = $("<td>");
    newDeparture
        .addClass("depart-cell")
        .attr("train", Trains.length)
        .text (departing.format("HH:mm"));
    
    var newFrequency = $("<td>");
    newFrequency.text (data.Frequency);

    var ETA = getETA (departing, data.Frequency);
    var newETA = $("<td>");
    newETA
        .addClass("eta-cell")
        .attr("train", Trains.length)
        .text(ETA.format("HH:mm"));

    // Apparently moment().diff() doesn't round seconds up to minutes.  Or at least that what appears
    // to be happening.  The minutes away cell in the table shows 0 minutes the cycle before the 
    // departure and arrival times change.

    var minutes = ETA.diff(moment(), "minutes") + 1;
    var newMin = $("<td>");
    newMin
        .addClass("min-cell")
        .attr("train", Trains.length)
        .text(minutes);


    newRow
        .append(newName)
        .append(newDestination)
        .append(newDeparture)
        .append(newFrequency)
        .append(newETA)
        .append(newMin);

    $("#schedule-table")
        .append(newRow);
    
}

function updateTable ()
{   // Update table #train-schedule with updated departure and arrival times

    tLength = Trains.length;
    for (i=0; i<tLength; i++)
    {
        var dTime = lastDeparture(Trains[i].Departure, Trains[i].Frequency);
        $(".depart-cell[train=" + i + "]").text (dTime.format("HH:mm"));
    
        var aTime = getETA(dTime, Trains[i].Frequency);
        $(".eta-cell[train=" + i + "]").text (aTime.format("HH:mm"));
    
        // Apparently moment().diff() doesn't round seconds up to minutes.  Or at least that what appears
        // to be happening.  The minutes away cell in the table shows 0 minutes the cycle before the 
        // departure and arrival times change.

        var minutes = aTime.diff(moment(), "minutes") + 1;
        $(".min-cell[train=" + i + "]").text (minutes);
    }
}

function makeDate (t)
{   // convert the time entered on the input for to a date, using today's date and the hours and
    // minutes entered on the form

    // Break the values for hours and minutes from the input string.  validateInput() ensures the
    // time was entered, and the input form ensures it was entered in the proper format.

    var bits = t.split(":");

    // Now let moment.js do it's magic

    var nDate = moment();
    nDate.hours(bits[0]).valueOf();
    nDate.minutes(bits[1]).valueOf();

    return nDate.format("YYYY/MM/DD HH:mm");
}

$(document).ready(function()
{   // Set an interval to update the schedule table every minute

    setInterval(updateTable, 60000);

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
                Departure: makeDate($("#train-depart").val().trim()),
                Frequency: $("#train-freq").val().trim()
            });

            // and clear the form...

            $("#train-name").val("");
            $("#train-dest").val("");
            $("#train-depart").val("");
            $("#train-freq").val("");
        }
    });

    database.ref().on("child_added", function(snap)
    {   //  Get data as it is added to the database

        var Train = snap.val();

        insertTable (Train);

        // And save this in Trains[] so the timer can update the table

        Trains.push(snap.val());
    })
});
