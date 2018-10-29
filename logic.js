$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyAwKKiPMVVnzZ2xADtp7hBjmP8CvtXCoOU",
        authDomain: "anything-you-want-7a13a.firebaseapp.com",
        databaseURL: "https://anything-you-want-7a13a.firebaseio.com",
        projectId: "anything-you-want-7a13a",
        storageBucket: "anything-you-want-7a13a.appspot.com",
        messagingSenderId: "529923747414"
    };
    firebase.initializeApp(config);


    // Assign the reference to the database to a variable named 'database'
    // var database = ...
    var database = firebase.database();


    var trains = [];

    database.ref("/trains").on("child_added", function (snapshot) {
     
        var snap = snapshot.val();

       trains.push({
           name: snap.name,
           destination: snap.destination,
           firstDeparture: snap.firstDeparture,
           frequency: snap.frequency,
           data: snapshot.key
        });

        renderTrains();
    
    }, function (error) {
        console.log("I AM ERROR " + error.code);
    });

    database.ref("/trains").on("child_removed", function(snapshot){
        
        for(let t in trains){
         
            if(trains[t].data === snapshot.key){
                trains.splice(trains.indexOf(trains[t]), 1);    
            }
        }
        
        renderTrains();
    },function(error){
        console.log("I AM ERROR " + error.code);
    });

    
    function renderTrains() {

        var dt = new Date();
        $("#trainList > tbody").empty();
        for (let train in trains) {


            var trainData = $("<tr>").attr("data", trains[train].data);
            trainData.append($("<td>").text(trains[train].name));
            trainData.append($("<td>").text(trains[train].destination));
            trainData.append($("<td>").text(trains[train].frequency));

            var arrival = getNextArrival(trains[train].firstDeparture, dt, parseInt(trains[train].frequency));
            var nextArrival = arrival[0];
            var minutesAway = arrival[1];

            trainData.append($("<td>").text(nextArrival));


            trainData.append($("<td>").text(minutesAway));
            var btn = $("<button>").text("DEL").addClass("delete btn btn-danger");

            trainData.append(btn);

            $("#trainList").append(trainData);
        };
    }
    function getNextArrival(start, now, freq) {

        if (freq < 1 || start == "null" || start == undefined || start === NaN) {
            return ["Never", 0];
        }

        start = moment(start, "HH:mm");
      
        var post, na, ma;
        var startTime = 60 * start.hour() + start.minute();
        var nowTime = 60 * now.getHours() + now.getMinutes();

        while (startTime <= nowTime) {

            startTime = startTime + freq;
        }

        ma = startTime - nowTime;

        var hour = Math.floor(startTime / 60);
        var min = startTime % 60;

        while (hour > 24) {
            hour -= 24;
        }

        if (hour > 12) {
            hour -= 12;
            post = " PM";
        } else {
            post = "AM"
        }

        if (min < 10) {
            min = "0" + min;
        }

        na = hour + ":" + min + post;

        return [na, ma];

    };


    $("#submitTrainBtn").on("click", function (e) {

        e.preventDefault();

        var dt = new Date();

        var name = $("#trainName").val().trim();
        var dest = $("#destination").val().trim();
        var dep = $("#firstDeparture").val().trim();

        if(!dep.match(":") || dep.length > 5){
            dep = "null";
        }else{
          
            dep = dep.split(":");

            if( dep[0].length > 2 ||
                dep[1].length >2  ||
                dep.length > 2 || 
                parseInt(dep[0]) > 23 || 
                parseInt(dep[0]) < 0 || 
                parseInt(dep[1]) < 0 || 
                parseInt(dep[1]) > 59
            ){
                dep = "null";
            }else{
                dep = dep[0] + ":" + dep[1];
            }
          
        }
    
 
        var freq = $("#frequency").val();
              
        if (freq == "" || freq < 0 || dest == "" || name == "" || dep == "null") {
       
        }
        else
       {
        var newTrain = {
            name: name,
            destination: dest,
            firstDeparture: dep,
            frequency: freq
        };

        database.ref("trains").push(newTrain);

       }
        
        $("#trainName").val("");
        $("#destination").val("");
        $("#firstDeparture").val("");   
        $("#frequency").val("");


    });

    $(document).on("click", ".delete", function (e) {
        e.preventDefault();
        for (let t in trains) {
            if (trains[t].data == this.parentNode.attributes.data.nodeValue) {
                this.parentNode.outerHTML = "";
                database.ref("trains").child(trains[t].data).remove();
            }
        }

       

     

    });

    setInterval(renderTrains, 60000);

});