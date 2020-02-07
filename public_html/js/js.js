function prepTask(id) {
    console.log("lmao");
    document.getElementById("list").innerHTML += "<div id=\"taskCont" + id + "\"></div>";
}

function runTask(Task, TimeStart, TimeStop, Date, Id) {
    return "<div class=\"task is" + isOdd(Id) + "\"><span class=\"duty\" contenteditable=true>" + Task + "</span><img class=\"arrow\" src=\"images/arrow_closed.png\" onclick=openTask(" + Id + ")><span class=\"time\">" + Date + " " + TimeStart + "-" + TimeStop + "</span></div>";
}

function prepOpenTask(Task, TimeStart, TimeStop, Date, Id, Notes, Status) {
    return "<div class=\"task open is" + isOdd(Id) + "\" id=\" task" + Id + "\">" +
        "<span class=\"duty\" contenteditable=true>" + Task + "</span>" +
        "<img class=\"arrow\" src=\"images/arrow_closed.png\" onclick=openTask(" + Id + ")>" +
        "<span class=\"time\">"
        + Date + " " + TimeStart + "-" + TimeStop + "</span></div>";
}
function openTask(i) {
    if (currentOpen != null) {
        document.getElementById("taskCont" + currentOpen).innerHTML = getTask(currentOpen);
    }
    currentOpen = i;

    document.getElementById("taskCont" + i).innerHTML = "";
    document.getElementById("taskCont" + i).innerHTML = getOpenTask(i);
}

function loadTasks() {
    for (i = 0; i < tasks.length; i++) {

        prepTask(i);

        console.log("doing the thihng");

        document.getElementById("taskCont" + i).innerHTML += getTask(i);

    }
}

function isOdd(num) {
    if (num % 2) return "Odd"
    else return "Even";
}

function getTask(i) {
    return runTask(
        duties[tasks[i]["Duty"]]["Name"],
        tasks[i]["TimeStart"].substring(11, 16),
        tasks[i]["TimeStop"].substring(11, 16),
        tasks[i]["Date"],
        i)
}
function getOpenTask(i) {
    return prepOpenTask(
        duties[tasks[i]["Duty"]]["Name"],
        tasks[i]["TimeStart"].substring(11, 16),
        tasks[i]["TimeStop"].substring(11, 16),
        tasks[i]["Date"],
        i,
        tasks[i]["Notes"],
        tasks[i]["Status"]
    )
}