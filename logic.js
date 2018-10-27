$(document).ready(function(){

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

database.ref().on("value", function(snapshot){
    if(snapshot.child("trains").exists && snapshot.val() != null){
        trains = JSON.parse(snapshot.val().trains);
        console.log(trains);
        renderTrains();
    }

    else{
        trains=[];
    }
},function(error){
    console.log("I AM ERROR " + error.code);
});

function getNextArrival(start, now, freq ){
    console.log("GOT " +  start + now + freq);
    if(freq < 1){
        return ["Never" , 0];
    }

    var post, na, ma;
console.log(start.getHours()+":"+start.getMinutes()+" O'Clock");
    var startTime = 60 * start.getHours() + start.getMinutes();
    var nowTime = 60 * now.getHours() + now.getMinutes();

    console.log("start: " + startTime + " now: " + nowTime);
    while(startTime <= nowTime){
        
        startTime = startTime + freq;
    }

  
    ma = startTime - nowTime;

    var hour = Math.floor(startTime/60);
    var min = startTime % 60;

    while(hour > 24){
        hour -= 24;
    }

    if(hour > 12){
        hour -=12;  
        post =" PM";
    }else{
        post ="AM"
    }

    if(min < 10){
        min = "0" + min;
    }
    na = hour + ":" + min + post;
   

    return [na, ma];
    
  

};

function renderTrains(){
  
    var dt = new Date();
    $("#trainList tbody").empty();
    for(let train in trains){
        console.log("rendering " + Object.keys(trains[train]) + trains[train].firstDeparture); 
     
        var trainData = $("<tr>").attr("data", trains[train].name);
        trainData.append($("<td>").text(trains[train].name));
        trainData.append($("<td>").text(trains[train].destination));
        trainData.append($("<td>").text(trains[train].frequency));
       
        var arrival = getNextArrival(new Date(trains[train].firstDeparture), dt, parseInt(trains[train].frequency));
        var nextArrival = arrival[0];
        var minutesAway = arrival[1];

        trainData.append($("<td>").text(nextArrival)); 

       
        trainData.append($("<td>").text(minutesAway));
        var btn = $("<button>").text("DEL").addClass("delete btn btn-danger");
       
        trainData.append(btn);

        $("#trainList").append(trainData);
    };
}

$("#submitTrainBtn").on("click", function(e){
    e.preventDefault();

    var dt = new Date();

    var name = $("#trainName").val();
    var dest =  $("#destination").val();
    var time = [$("#hourInput").val(), $("#minInput").val()];
    var first = new Date(  dt.getFullYear(), dt.getMonth(), dt.getDate() , time[0], time[1]);
    var freq = $("#frequency").val();
    
    if(name == ""){
        name = "No name";
    }
    if(dest == ""){
        dest = "No destination"
    }
    if(!first){
        first = dt;
    }
    if(freq == NaN){
        freq = 1;
    }

    var newTrain = {
        name: name,
        destination: dest,
        firstDeparture: first,
        frequency : freq
    };

    trains.push(newTrain);

    database.ref().set({
        trains: JSON.stringify(trains)
    });
    renderTrains();
    
});

$(document).on("click", ".delete", function(e){
    e.preventDefault();
    for(let t in trains){
        if(trains[t].name == this.parentNode.attributes.data.nodeValue){
            console.log("GOT EM");

            trains.splice(t, 1);
        }
    }
    database.ref().set({
        trains: JSON.stringify(trains)
    });
    console.log(this.parentNode.attributes.data.nodeValue)
    

});

renderTrains();
setInterval(renderTrains, 1000);

});