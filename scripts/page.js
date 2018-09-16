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

function getDate (d)
{   // Get the date from the data

    return moment(d, "YYYY/MM/DD HH:mm").format("YYYY/MM/DD");
}

function getTime (d)
{   // Get the time (in 24-hour format) from the data

    return moment(d, "YYYY/MM/DD HH:mm").format("HH:mm");
}

function getETA (depart, freq)
{   // Calculate the ETA and "minutes away" from the departure time and frequency of
    // runs
console.log("getETA()");
//     var now = moment();
    var mDepart = moment(depart, "YYYY/MM/DD HH:mm");

    var delta = moment().diff(mDepart);
console.log("delta: ", delta);
    var minutes = delta % freq;
console.log("minutes: ", minutes);

    // if delta or minutes are negative, the train hasn't started running yet.  Calculate
    // ETA from the departure time, but minutes away from current time (as always).
    var ETA = 0;

    if (delta < 0)
        ETA = mDepart.add(freq, "minutes").format("HH:mm");
    else
        ETA = moment().add(minutes, "minutes").format("HH:mm");
    
    return ETA;
}

function insertTable (data)
{   // Insert the data just received from Firebase into the table #train-schedule

    var newRow = $("<tr>");

    var newName = $("<td>");
    newName.text (data.Name);

    var newDestination = $("<td>");
    newDestination.text (data.Destination);
    
    var newDeparture = $("<td>");
//     newDeparture.text (data.Departure);
    newDeparture.html (getDate(data.Departure) + "<br>" + getTime(data.Departure));
    
    var newFrequency = $("<td>");
    newFrequency.text (data.Frequency);

//     format = moment.format;

//     var bits = data.Departure.split(":");
// // //     var minutes = (bits[0] * 60) + (bits[1] * 1);
// // // //     var dHour = moment(data.Departure, "HH");
// // // // console.log("dHour: ", dHour);
// // // //     var dMin = moment(data.Departure, "MM");
// // // // console.log("dMin: ", dMin);
// // // //     var minutes = (dHour * 60) + dMin;
// // // console.log("insertTable()");
// // // console.log("Departure: ", data.Departure);
// // // console.log("minutes: ", minutes);
// // // //     var minutes = moment.differenceInMinutes (now, startMin);
// // // // console.log("minutes: ", minutes);
// // //     var minutesToGo = minutes % data.Frequency;
// // // console.log("minutesToGo: ", minutesToGo);
// // // // var now = moment().format("HH:MM");
// // // var now = moment(new Date(), "HH:MM");
// // // console.log("now: ", now);
// // // // console.log("moment(now): ", moment(1432, "HH:MM"));
// // // // var nowPlus = now + minutesToGo;
// // // // console.log("nowPlus: ", nowPlus);
// // //     var ETA = moment(now).add(minutesToGo, "minutes");
// // // console.log("ETA: ", ETA);
// // // // console.log("")
// // // var minutes = moment(new Date()).diff(moment(data.Depatrure, "HH:MM"));
// // // var minutes = moment(data.Depatrure, "HH:MM").diff(moment(), "minutes");
// // //     var departing = moment(data.Daparture, "HH:MM");
// //     var departing = moment(bits[0]+bits[1], "HH:MM");
// //     var departing = moment("18:00", "HH:MM");
// // console.log("departure: ", departing);
// // // console.log("minutes: ", minutes);
// // 
// // //     var newETA = $("<td>");
// // //     newETA.text(ETA);
// // // 
// // //     var newArrival = $("<td>");
// // //     newArrival.text(minutesToGo);
//     var currentTime = moment(moment()).format("HH:mm");
// console.log(moment());
// console.log("currentTime: ", typeof currentTime);
// console.log("departing: ", data.Departure);
// console.log(currentTime + data.Departure);
//     var dd = moment();
// console.log("bits[0]", bits[0]);
// console.log("bits[1]", bits[1]);
//     dd.hours(bits[0]).valueOf();
//     dd.minutes(bits[0]).valueOf();
// console.log("dd: ", dd);
// if (currentTime.substring(1,2) < data.Daparture.substring(1,2))
// //     if ("15:30" < "18:00")
//         console.log("The train left yesterday");
// makeDate(data.Departure);
    var ETA = getETA (data.Departure, data.Frequency);

    var newETA = $("<td>");
    newETA.text(ETA);

    newRow
        .append(newName)
        .append(newDestination)
        .append(newDeparture)
        .append(newFrequency)
        .append(newETA)
//         .append(newArrival);

    $("#schedule-table")
        .append(newRow);
    
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

console.log("#train-submit");
        if (validateInput ())
        {   // The data is good...put it into Firebase

            database.ref().push(
            {   Name: $("#train-name").val().trim(),
                Destination: $("#train-dest").val().trim(),
                Departure: makeDate($("#train-depart").val().trim()),
                Frequency: $("#train-freq").val().trim()
            })
        }
    });

    database.ref().on("child_added", function(snap)
    {   //  Get data as it is added to the database

// console.log(snap.val());
        var Train = snap.val();

        insertTable (Train);
    })
});
