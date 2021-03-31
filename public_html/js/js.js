/*
Task:
ID
DutyID,
Date,
TimeStart,
TimeStop, 
Notes,

Duty:
ID,
Name
*/

//TaskOrder är alla Tasks Id som de ska komma för att vara i ordning

let Duties = [];
let TaskOrder = [];

let lastID = 0;
let request = new XMLHttpRequest();
function onLoad() {
    getDuties();

}

//Få tag i duties och tasks
function getDuties() {

    request.open("GET", "API/getDuties.php", true);
    request.onload = function () {

        Duties["new"] = { id: -1, Name: "Ny Task" };
        recieved = JSON.parse(request.response);
        recieved.forEach(element => {
            Duties[element.ID] = element;
        })
        getSettings();//who dont löve the hyper-thräding? apoliguze teh spaghet
    }
    request.send();
}

function getSettings() {
    request.open("GET", "API/getProjectVariables.php", true);
    request.onload = function () {
        settings = JSON.parse(this.response);
        getTasks();
    }
    request.send();

}

//Få tag i tasks
function getTasks() {
    request.open("POST", "API/getTasklist.php", true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.onload = function () {
        recieved = JSON.parse(this.response);
        Tasks = []; //Få Tasks och TaskOrder
        recieved.forEach(element => {
            Tasks[element.ID] = element;
            TaskOrder.push(element.ID); //Behåll ordningen som tasksen ska följa
            Tasks[element.ID] = defaultValues(Tasks[element.ID]);
        })
        createList();//Ut ur spatghetting
        createPageNumbers();
    }
    if (Cookies.get("page")) { //Skicka vilka poster vi vill ha tillbaka
        pages = Cookies.get("page");
        console.log("limitFrom=" + (pages * settings["Rows"] - settings["Rows"]));
        request.send("limitFrom=" + (pages * settings["Rows"] - settings["Rows"]));
    }
    else
        request.send();
}

function createPageNumbers() {
    if(!(Cookies.get("page"))) Cookies.set("page", 1);
    setTasks = Cookies.get("page") * settings["Rows"] - settings["Rows"]; //Ifall man är på page 5 så får man allt från 50-150, därför måste värden från tidigare pages också räknas här

    Tasks.forEach(element => {
        if (element != null) setTasks++;
    })

    pages = Math.ceil(setTasks / settings["Rows"]);

    if (pages > 1) { //Visa bara ifall det finns mer än en page
        let str = "";

        if (pages < 5) {
            for (i = 1; i <= pages; i++) {
                str += "<a onclick=\"setPage(" + i + ")\">" + i + "</a> ";
            }
        }
        document.getElementById("pageDiv").innerHTML = str;
    }
}
function setPage(value) {

    location.reload();

    Cookies.set("page", value);
}