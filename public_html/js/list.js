
function createList() {
    i = 0;
    max = settings["Rows"];
    TaskOrder.forEach(element => {
        if (i < max) { //break fuungerar inte i foreach
            Items.push(new Item(Tasks[element]));
            i++;
        }
    })
}

/**Skapar en ny element i listan */
function createListItem(id, taskID) {
    return document.getElementById("list").innerHTML += "<div class=\"task is" + isOdd(id / 6) + "\" id=\"item" + id + "\" onmousedown=onClick(" + id + ") onmouseover=onMouseEnter(" + id + ") onmouseout=onMouseLeave(" + id + ")></div>";
}


function onClick(id) {
    if (hasClass(id, "element")) {
        parentID = document.getElementById("item" + id).parentElement.id.replace("item", "");
        if (hasClass(parentID, "open")) removeClass(parentID, "open");

        else addClass(parentID, "open");

        //Kolla vad som just blev klickat, gör inget ifall den redan är öppen
        if (hasClass(id, "duty") && !hasClass(id, "beingModified")) {
            Items[parentID / 6].setToModifyable("duty");
        }
        else if (hasClass(id, "dates") && !hasClass(id, "beingModified")) {
            Items[parentID / 6].setToModifyable("date");
        }
        else if (hasClass(id, "times") && !hasClass(id, "beingModified")) {
            Items[parentID / 6].setToModifyable("time")
        }
        else if (hasClass(id, "notes ") && !hasClass(id, "beingModified")) {
            Items[parentID / 6].setToModifyable("notes")
        }
    }
    else {
        if (hasClass(id, "open")) removeClass(id, "open");

        else addClass(id, "open");

    }
}

function onMouseEnter(id) {
    addClass(id, "hovering");
}

function onMouseLeave(id) {
    removeClass(id, "hovering");
}

function isOdd(num) {
    if (num % 2) return "Odd"
    else return "Even";
}

Items = []


/**Förbered en Task Template */
function newTask() {
    request.open("POST", "API/saveTask.php", true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send("new=true");
    request.onload = function () {
        task = {
            DutyID: "new",
            Date: "dd/mm/yyyy",
            TimeStart: "00:00",
            TimeStop: "23:59",
            Notes: "",
            ID: JSON.parse(this.response)["ID"]
        }
        Task = Items.push(new Item(task));
    }
}
/**Lägger till en nolla tills strängen blir 2chars lång (ex. 2->02)*/
function dualInt(input) {

    while (input.length < 2) input = "0" + input;
    return input;
}

/**Tanka ut till databasen */
function saveTaskToDatabase(Task) {
    request.onload = null;
    request.open("POST", "API/saveTask.php", true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send("TaskID=" + Task.ID + "&DutyID=" + Task.DutyID + "&Date=" + Task.Date + "&TimeStart=" + Task.TimeStart + "&TimeStop=" + Task.TimeStop + "&Notes=" + Task.Notes);
}

function removeTask(ID) {
    //If button is actually vissible, if stops working, change z-index of removebutton (while parent not open) to -1, currently still clickable when hidden, which is why we do this check
    if (hasClass(ID, "open")) {
        if (confirm("Vill du ta verkligen ta bort den här?")) {

            request.open("POST", "API/deleteTask.php", true);
            request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            request.onload = function () {
                if (JSON.parse(this.response)[0] == true)

                    removeElement(ID);
            };
            request.send("ID=" + Items[ID / 6].Task.ID);

        }
    }
}

function defaultValues(Task) {
    if (Task.DutyID == "" || Task.DutyID == null) { //Kolla ifall faktist behlver if null TODO
        Task.DutyID = "new";
    }
    if (Task.TimeStart == "") {
        Task.TimeStart = "??:??";
    }
    if (Task.TimeStop == "") {
        Task.TimeStop = "??:??";
    }
    if (Task.Date == "--") {
        var today = new Date();
        var day = String(today.getDate()).padStart(2, '0');
        var month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var year = today.getFullYear();

        Task.Date = "Inte angivet";
    }

    return Task;
}