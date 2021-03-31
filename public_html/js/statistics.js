let main, taskDaysChart;
let TaskOrder = [];
function onRun(){
    main = document.getElementById("main");
    taskDaysChart = document.getElementById("taskDaysChart");

    prepTaskDaysChart();
}

function onLoad() {
    request = new XMLHttpRequest();
    request.open("GET", "API/getDuties.php", true);
    request.onload = function () {
        Duties = [];
        Duties["new"] = { id: -1, Name: "Ny Task" };
        recieved = JSON.parse(this.response);
        recieved.forEach(element => {
            Duties[element.ID] = element;
        })
        console.log(JSON.parse(this.response));
        getTasks();//who dont löve the hyper-thräding? apoliguze teh spaghet
    }
    request.send();
}

function getTasks() {
    request.open("GET", "API/getTasklist.php", true);
    request.onload = function () {
        recieved = JSON.parse(this.response);
        Tasks = [];
        
        recieved.forEach(element => {
            TaskOrder.push(element.ID);
            Tasks[element.ID] = element;
            if (Tasks[element.ID].DutyID == null) {
                Tasks[element.ID].DutyID = "new";
            }
        })
        onRun();//Now we be out of teh spaghet
    }
    request.send();
}
//Prep diagram
function prepTaskDaysChart(){
    let data = []; 
    let names = [];

    let lastDate;
    TaskOrder.forEach(element => {
        if(Tasks[element]["Date"] == lastDate){
            data[data.length - 1]++;
        }    
        else{
            data.push(1);
            names.push(Tasks[element]["Date"]);
            lastDate = Tasks[element]["Date"];
        }
    });

    if(data.length > 50){ //Ifall det blir för mycket data, splitra up till månader
        data = [];
        names = [];
        Tasks.forEach(element => {
            if(element["Date"].split("-")[2] == lastDate){
                data[data.length - 1]++;
            }    
            else{
                data.push(1);
                names.push(element["Date"].split("-")[1]); //TODO fixa att det visas månadsnamn istället för ett nummer
                lastDate = element["Date"].split("-")[1];
            }
        });
    }

    ctx = document.getElementById("taskDaysChart").getContext("2d");
    createChart(ctx,{"data":data, "label":"Tasks per dag" },names,"line");




    data2 = [];
    names = [];

    Tasks.sort((a,b) => (a["DutyID"] > b["DutyID"]) ? 1 : -1);
    let lastDuty;

    Tasks.forEach(element=>{
        if(lastDuty == element.DutyID){
            data2[data2.length - 1]++;
        }
        else{
            data2.push(1);
            names.push(Duties[element.DutyID].Name);
            lastDuty = element.DutyID;
        }
    })

    ctx = document.getElementById("dutySpreadChart").getContext("2d");
    createChart(ctx,{"data": data, "label": "Totala duties"},names, "bar")

    data = [];
    names = [];

    lastDuty = null

    Tasks.forEach(element =>{
        if(lastDuty == element.DutyID){
            data[data.length - 1] += parseFloat(hm2dec(diff(element.TimeStart, element.TimeStop).split(".")));
        }
        else{
            names.push(Duties[element.DutyID].Name);
            data.push(parseFloat(hm2dec(diff(element.TimeStart, element.TimeStop).split(":"))));
            lastDuty = element.DutyID;
        }
    })



    ctx = document.getElementById("hoursPerDutyChart").getContext("2d");
    createChartNoBackground(ctx,{"data":data, "label": "Timmar per task"},names, "radar");

    colors = [];
    for(i = 0; i < data.length; i++){
        colors.push(randomColor());
    }
    ctx = document.getElementById("hoursAndTasksChart").getContext("2d");
    createDoubleChart(ctx,[{"data":data, "label": "Tid per duty"}, {"data":data2,"label": "Tasks per duty"}], names, "doughnut", colors)

}

function createChart(ctx,dataset, names, type){
    var myChart = new Chart(ctx, {
        type: type,
        data: {
            labels: names,
            datasets: [{
                label: dataset.label,
                data: dataset.data,
                backgroundColor: "#52328f80",
                borderColor: "#52328f80",
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                angleLines: {
                    display: false
                },
            }
        }
    });
}

function createChartNoBackground(ctx,dataset, names, type){
    var myChart = new Chart(ctx, {
        type: type,
        data: {
            labels: names,
            datasets: [{
                label: dataset.label,
                data: dataset.data,
                backgroundColor: "#52328f80",
                borderColor: "#52328f80",
                borderWidth: 1
            }]
        },
        options:{
            scale: {
                angleLines: {
                    display: false
                },
                ticks: {
                    suggestedMin: 0,
                }
            }
        }
    });
}

function createDoubleChart(ctx,dataset, names, type, backgroundColor){
    var myChart = new Chart(ctx, {
        type: type,
        data: {
            labels: names,
            datasets: [{
                label: dataset[0].label,
                data: dataset[0].data,
                backgroundColor: backgroundColor,
                borderColor: "#52328f80",
                borderWidth: 1
            },
            {
                label: dataset[1].label,
                data: dataset[1].data,
                backgroundColor: backgroundColor,
                borderColor: "#52328f80",
                borderWidth: 1
            }]
        },
    });
}


function randomColor(){
    return `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.4)`; 
}

function diff(start, end) { //https://stackoverflow.com/questions/10804042/calculate-time-difference-with-javascript
    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);
    
    return (hours < 9 ? "0" : "") + hours + ":" + (minutes < 9 ? "0" : "") + minutes;
}
function hm2dec(hoursMinutes) {
    var hours = parseInt(hoursMinutes[0], 10);
    var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return (hours + minutes / 60).toFixed(2);
}