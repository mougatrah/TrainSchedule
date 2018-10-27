$(document).ready(function(){

var trains = [{name:"transsiberian",
               destination: "siberia",
            firstDeparture: new Date("oct 31 2018 12:30"),
            frequency: 25}];


function getNextArrival(start, now, freq ){

    if(freq < 1){
        return ["Never" , 0];
    }

    var post, na, ma;

    var startTime = 60 * start.getHours() + start.getMinutes();
    var nowTime = 60 * now.getHours() + now.getMinutes();

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

        var trainData = $("<tr>");
        trainData.append($("<td>").text(trains[train].name));
        trainData.append($("<td>").text(trains[train].destination));
        trainData.append($("<td>").text(trains[train].frequency));

        var arrival = getNextArrival(trains[train].firstDeparture, dt, parseInt(trains[train].frequency));
        var nextArrival = arrival[0];
        var minutesAway = arrival[1];

        trainData.append($("<td>").text(nextArrival)); 

       
        trainData.append($("<td>").text(minutesAway));
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
    renderTrains();
    
});

renderTrains();
setTimeout(renderTrains, 60000);

});