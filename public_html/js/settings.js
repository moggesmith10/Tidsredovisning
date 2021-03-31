//Spaghetti del 1, ritolini, first blood
let request = new XMLHttpRequest();
request.open("GET", "API/getProjectVariables.php", true);
request.onload = function () {
    settings = JSON.parse(this.response);
    getDuties();
}
request.send();

//Spaghetti del 2, return of the pasta
function getDuties() {
    request.open("GET", "API/getDuties.php", true);
    request.onload = function () {
        Duties = [];
        returned = JSON.parse(this.response);
        returned.forEach(element => {
            Duties[element["ID"]] = { "Name": element["Name"], "ID": element["ID"] }
        })
        getTasks();
    }
    request.send();
}

//Spaghetti del 3, all noodles on deck
function getTasks() {
    request.open("GET", "API/getTasklist.php", true);
    request.onload = function () {
        TaskOrder=[];
        Tasks = [];
        JSON.parse(this.response).forEach(element=>{
        TaskOrder.push(element.ID);
        Tasks[element.ID] = element;
        });

        runSiteBuilder();
    }
    request.send();
}


//Spaghetti del 4, the end of spaghet
function runSiteBuilder() {
    //Projektnamn
    document.getElementById("projectNameSpan").innerHTML = settings["ProjectName"];

    document.getElementById("rows").children[0].value = settings["Rows"];

    //Dutylist
    s = "";
    Duties.forEach(element => {//Loopa genom alla data och printa till s
        s += "<tr id=\"task" + element["ID"] + "\"><td>" +
            "<div class=\"removeDutyButton\" onclick=removeDuty(" + element.ID + ")></div>" +//Ta bort knapp
            /*byt namn knapp->*/"<div class=\"renameButton\" onclick=renameDuty(" + element.ID + ")></div></td><td><div id=\"taskName" + element.ID + "\">" + element.Name + "</td></tr>";
    });
                                        //TBody
    document.getElementById("dutyList").children[0].innerHTML += s; //Lägg in s i tabelen
}

function changeProjectName() {
    document.getElementById("settings").innerHTML = "Projektnamn: <input id=\"projectNameInput\" type=\"text\" value=\"" + settings["ProjectName"] + "\"><button onclick=\"saveProjectName()\">Spara</button>"
}

function updateRows(){
    request.onload = null;
    request.open("POST", "API/setProjectVariable.php", true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send("variable=Rows&newVal=" + document.getElementById("rows").children[0].value);
}

function saveProjectName() {
    settings["ProjectName"] = document.getElementById("projectNameInput").value;//Plocka fram variabeln
    //Updatera sidan
    document.getElementById("settings").innerHTML = "Projektnamn: " + settings["ProjectName"] + " <button onclick=\"changeProjectName()\">Ändra</button>"
    document.getElementById("title").innerHTML = settings["ProjectName"]

    //Ladda up till databasem
    request.onload = null;
    request.open("POST", "API/setProjectVariable.php", true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send("variable=ProjectName&newVal=" + settings["ProjectName"]);
}

function removeDuty(id) {
    //Kan göra skumma saker annars...
    request.onload = null;

    if (confirm("Är du säker att du vill ta bort \"" + Duties[id].Name + "\" från dina Duties?")) {
        //Använder någon task den här dutyn?
        canRun = true;
        Tasks.forEach(element => {
            if (element.DutyID == id) {
                canRun = false;
            }
        });

        if (!canRun) { //I så fall, vill vi ta bort dem?
            if (confirm("Det finns Tasks som använder den här Dutyn, vill du ta bort dem?")) {
                Tasks.forEach(element => {
                    if (element.DutyID == id) {
                        request.open("POST", "API/deleteTask.php", true);
                        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                        request.send("ID=" + element.ID);
                    }
                });

                request.open("POST", "API/deleteDuty.php", true);
                request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                request.onload = function () {
                    if (JSON.parse(this.response)[0] == true) {
                        document.getElementById("task" + id).remove();
                    }
                }
                request.send("ID=" + id);
            }
            //Ifall inte så gör vi inget mera
        }
        else { //Ifall inga tasks änvänder dutyn, ta bort den
            request.open("POST", "API/deleteDuty.php", true);
            request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            request.onload = function () {
                console.log(JSON.parse(this.response));
                if (JSON.parse(this.response)[0] == true) {
                    document.getElementById("task" + id).remove();
                }
            }
            request.send("ID=" + id);

        }
    }
}

function renameDuty(id) {
    newName = prompt("Vad ska dutyn heta?", Duties[id].Name);

    if (newName != null && newName != "") {
        //Updatera DB
        request.onload = null;
        request.open("POST", "API/saveDuty.php?id=" + id, true);
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.onload = function () {
            //Updatera sida
            document.getElementById("taskName" + id).innerHTML = newName;
        }
        request.send("Name=" + newName + "&ID=" + id);


    }
}
function addDuty() {
    name = prompt("Vad ska den nya dutyn heta?");

    //Uppdatera DB
    request.open("POST", "API/saveDuty.php", true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send("Name=" + name);
    request.onload = function () {
        returned = settings = JSON.parse(this.response);
        console.log(returned);
        returned = returned["row"]; //Ta sig ut ur root
        if (returned != false) { //False får man ifall servern inte bytte namn
            //Skriv ut den nya dutyn
            //returned[0] är det nya ID på dutyn
            document.getElementById("dutyTable").children[0].innerHTML += "<tr id=\"task" + returned + "\"><td>" +
                "<img src=\"images/red_128.png\" onclick=removeDuty(" + returned + ")> " +
                "<img src=\"images/yellow_128.png\" onclick=renameDuty(" + returned + ")>" + "</td><td><div id=\"taskName" + returned + "\">" + name + "</td></tr>";
        }
        Duties[returned] = ({ "Name": name, "ID": returned });
    };
}