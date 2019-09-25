

// 1. Initialize Firebase
$(document).ready(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyC-4JUnlX4rfGuonosIynO5WtYPmZVcV6c",
    authDomain: "trainschedulecpk.firebaseapp.com",
    databaseURL: "https://trainschedulecpk.firebaseio.com",
    projectId: "trainschedulecpk",
    storageBucket: "",
    messagingSenderId: "1021984474089",
    appId: "1:1021984474089:web:f7851e0808019cca014178",
    measurementId: "G-873YH8DRGX"
  };
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#where-input").val().trim();
  var firstTrain = moment($("#start-input").val().trim(), "HH:mm").format("X");
  var howOften = $("#Frequency-input").val().trim();

  // Creates local "temporary" object for holding employee data
  var newTrain = {
    name: trainName,
    where: destination,
    start: firstTrain,
    Frequency: howOften
  };
  console.log(newTrain)
  // Uploads employee data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.where);
  console.log(newTrain.start);
  console.log(newTrain.Frequency);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#where-input").val("");
  $("#start-input").val("");
  $("#Frequency-input").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var destination = childSnapshot.val().where;
  var firstTrain = childSnapshot.val().start;
  var howOften = childSnapshot.val().Frequency;

  // Employee Info
  console.log(trainName);
  console.log(destination);
  console.log(firstTrain);
  console.log(howOften);

  // Prettify the employee start
  var firstTrainPretty = moment.unix(firstTrain).format("HH:mm");
  var firstTimeConverted = moment(firstTrainPretty, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);
  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % howOften;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = howOften - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
  


  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text("Every: "+howOften+" Minutes"),
    // $("<td>").text(firstTrainPretty),
    $("<td>").text(moment(nextTrain).format("hh:mm")),
    $("<td>").text(tMinutesTillTrain)
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});
});
