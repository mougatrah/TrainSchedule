$(document).ready(function(){

var trains = [{name:"transsiberian",
               destination: "siberia",
            firstDeparture: new Date("oct 31 2018 04:20"),
            frequency: 1200}];


function getNextArrival(start, now, freq ){

    var post;
    var startHours = start.getHours();
    var startMin = start.getMinutes();
    var nowHours = now.getHours();
    var nowMin = now.getMinutes();
    console.log(startHours < nowHours);

    while(startHours <= nowHours){
        startMin += freq;
        while(startMin >= 59){
            startHours++;
            startMin = startMin - 60;
        }
        
        console.log(startHours +":" + startMin);
    
    }
    if(startMin >= 59){
        startHours++;
        startMin = startMin - 60;
    }
  
    if(startHours > 12){
        startHours -= 12;
        post = "PM";
    }else{
        post = "AM";
    }

    var ma =  (60-nowMin)+ startMin;

    if(startMin < 10){
        startMin = "0"+ startMin;
    }   
   
    console.log("min away: " + ma);
    var na = startHours +":"+ startMin + " " + post;
    console.log("next arr: " +na);

    return [na, ma];
};

function renderTrains(){
    var dt = new Date();
    $("#trainList tbody").empty();
    for(let train in trains){

        var trainData = $("<tr>");
        trainData.append($("<td>").text(trains[train].name));
        trainData.append($("<td>").text(trains[train].destination));
        trainData.append($("<td>").text(trains[train].frequency));

        var arrival = getNextArrival(trains[train].firstDeparture, dt, trains[train].frequency);
        var nextArrival = arrival[0];
        var minutesAway = arrival[1];
        console.log(nextArrival);
        trainData.append($("<td>").text(nextArrival)); 

       
        trainData.append($("<td>").text(minutesAway));
        $("#trainList").append(trainData);
    };
}

$("#submitTrainBtn").click(function(e){
    e.preventDefault();

    var dt = new Date();
    
    var newTrain = {
        name: $("#trainName").val(),
        destination: $("#destination").val(),
        firstDeparture: new Date(  dt.getFullYear(), dt.getMonth(), dt.getDate() , $("#firstDeparture").val()),
        frequency : $("#frequency").val()
    };
    console.log(newTrain.firstDeparture);
    trains.push(newTrain);
    
});

renderTrains();
setTimeout(renderTrains, 60000);

});