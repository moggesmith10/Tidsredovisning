/*

Task:
Duty (ID),
Date,
TimeStart,
TimeStop, 
Notes,
Status

Duty:
ID,
Name

ListItem:
id = taskX
class = task
*/

let Tasks, Duties;

let lastID = 0;

function getDuties() {
    let request = new XMLHttpRequest();
    request.open("GET", "API/getDuties.php", true);
    request.onload = function () {
        Duties = JSON.parse(this.response);
        getTasks();//who dont löve the hyper-thräding? apoliguze teh spaghet
    }
    request.send();
}

function getTasks() {
    let request = new XMLHttpRequest();

    request.open("GET", "API/getCompilation.php?from=1&to=2", true);
    request.onload = function () {
        Tasks = JSON.parse(this.response);
        createList();
    }
    request.send();
}


function createListItem(id) {
    return document.getElementById("list").innerHTML += "<div class=\"task is" + isOdd(id) + "\" id=\"item" + id + "\" onmousedown=onClick(" + id + ") onmouseover=onMouseEnter(" + id + ") onmouseout=onMouseLeave(" + id + ")></div>";
}

/**Creates a new element */
function createElement(parentID, elementId, classes, value) {
    document.getElementById("item" + parentID).innerHTML += " <span class=\"" + classes + " element\" id=\"item" + elementId + "\" onmousedown=onClick(" + elementId + ")>|" + value + "</span>";
    return document.getElementById("item" + elementId);
}

/**Modifies an existing element, parentID is not used, but allows a createElement call to be copied and changed to a modifyElement
 * @elementID element to change
 * @classes classes to set
 * @newValue new value for the element
*/
function modifyElement(parentID, elementId, classes, newValue) {
    document.getElementById("item" + elementId).outerHTML = "<span class=\"" + classes + " element\" id=\"item" + elementId + "\" onmousedown=onClick(" + elementId + ")>|" + newValue + "</span>"

}

function addClass(idToChange, newClasses) {
    document.getElementById("item" + idToChange).className += " " + newClasses;
}

function removeClass(idToChange, oldClasses) {
    while (document.getElementById("item" + idToChange).className.includes(oldClasses))
        document.getElementById("item" + idToChange).className = document.getElementById("item" + idToChange).className.replace(" " + oldClasses, "");
}

function hasClass(idToCheck, classToCheck) {
    return document.getElementById("item" + idToCheck).className.includes(classToCheck);
}

function onLoad() {
    getDuties();
}

function onClick(id) {

    if (hasClass(id, "element")) {
        console.log(document.getElementById("item" + id).parentElement.id.replace("item", ""))
        parentID = document.getElementById("item" + id).parentElement.id.replace("item", "");
        if (hasClass(parentID, "open")) removeClass(parentID, "open");

        else addClass(parentID, "open");

        if (hasClass(id, "duty") && !hasClass(id, "beingModified")) {
            Items[parentID / 5].setToModifyable("duty");
        }
        else if (hasClass(id, "dates") && !hasClass(id, "beingModified")) {
            Items[parentID / 5].setToModifyable("date");
        }
        else if (hasClass(id, "times") && !hasClass(id, "beingModified")) {
            Items[parentID / 5].setToModifyable("time")
        }
        else if (hasClass(id, "notes ") && !hasClass(id, "beingModified")) {
            Items[parentID / 5].setToModifyable("notes")
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

function createList() {

    for (i = 0; i < Tasks.length; i++) {
        Items.push(new Item(Tasks[i]))
    }
}

function Item(Task) {
    this.Task = Task
    this.ID = lastID++;
    createListItem(this.ID);
    this.Duty = createElement(this.ID, lastID++, "duty", Duties[Task.Duty].Name);
    this.Times = createElement(this.ID, lastID++, "time times", Task.TimeStart + "-" + Task.TimeStop)
    this.Dates = createElement(this.ID, lastID++, "time dates", Task.Date)

    //Adds trailing ... if needed
    if (Task.Notes.length > 50)
        this.Notes = createElement(this.ID, lastID++, "notes", "<span title=\"" + this.Task.Notes + "\">" + Task.Notes.substring(0, 50) + "..." + "</span>");
    else if (Task.Notes.length < 1)
        this.Notes = createElement(this.ID, lastID++, "notes", "<span title=\"Antekningar\">Antekningar</span>");
    else
        this.Notes = createElement(this.ID, lastID++, "notes", "<span title=\"" + this.Task.Notes + "\">" + Task.Notes + "</span>");

    this.setToModifyable = function (toModify) {
        switch (toModify) {
            case "duty":
                newString = "<select>" + Duties[this.Task.Duty].Name
                Duties.forEach(element => {
                    if (Duties[this.Task.Duty].Name == element.Name)
                        newString += "<option selected>" + element.Name + "</option>";
                    else
                        newString += "<option>" + element.Name + "</option>";
                });
                newString += "</select><button onmouseup=Items[" + this.ID / 5 + "].saveModifyable(\"duty\")>Spara</button>";
                modifyElement(this.ID, this.ID + 1, "duty", newString);
                addClass(this.ID + 1, "beingModified");
                break;
            case "date":
                newString = "<input type=\"text\" value=\"" + Task.Date + "\"><button onmouseup=Items[" + this.ID / 5 + "].saveModifyable(\"date\")>Spara</button>";
                modifyElement(this.ID, this.ID + 3, "time dates", newString);
                addClass(this.ID + 3, "beingModified");
                break;
            case "time":
                newString = "<input type=\"text\" value=\"" + this.Task.TimeStart + "-" + this.Task.TimeStop + "\"><button onmouseup=Items[" + this.ID / 5 + "].saveModifyable(\"time\")>Spara</button>";
                modifyElement(this.ID, this.ID + 2, "time times", newString);
                addClass(this.ID + 2, "beingModified");
                break;
            case "notes":
                newString = "<textarea cols=100 rows=2>" + this.Task.Notes + "</textarea><button onmouseup=Items[" + this.ID / 5 + "].saveModifyable(\"notes\")>Spara</button>";
                modifyElement(this.ID, this.ID + 4, "notes", newString);
                addClass(this.ID + 4, "beingModified");
                break;
        }
    }
    this.saveModifyable = function (toModify) {
        switch (toModify) {
            case "duty":
                this.Duty = document.getElementById("item" + (this.ID + 1));
                this.DutyStr = this.Duty.children[0].selectedIndex;
                this.Task.Duty = this.DutyStr;
                this.Duty = modifyElement(this.ID, this.ID + 1, "duty", Duties[Task.Duty].Name);
                removeClass(this.ID, "hovering");
                break;
            case "date":
                this.Date = document.getElementById("item" + (this.ID + 3));
                this.dateNewVal = this.Date.children[0].value;
                this.dateNewValArr = this.dateNewVal.split("-");
                //TODO fix backend verification
                if (this.dateNewValArr[0] <= 31 && this.dateNewValArr[1] <= 12 && this.dateNewValArr[2] > 1970 && this.dateNewValArr[0] > 0 && this.dateNewValArr[1] > 0) {
                    this.Task.Date = this.Date.children[0].value;
                }
                else {
                    alert("Ogiltigt format")
                }
                this.Dates = modifyElement(this.ID, this.ID + 3, "time dates", this.Task.Date)
                break;
            case "time":
                this.newTimeArr = document.getElementById("item" + (this.ID + 2)).children[0].value.split("-");
                canRun = true;
                for (i = 0; i < 2; i++) {
                    if (!(this.newTimeArr[i].split(":")[0] < 24 && this.newTimeArr[i].split(":")[1] < 60)) canRun = false;
                }

                if (canRun) {
                    //Adds starting zeroes
                    this.Task.TimeStart = dualInt(this.newTimeArr[0].split(":")[0]) + ":" + dualInt(this.newTimeArr[0].split(":")[1]);
                    this.Task.TimeStop = dualInt(this.newTimeArr[1].split(":")[0]) + ":" + dualInt(this.newTimeArr[1].split(":")[1]);
                    this.Times = modifyElement(this.ID, this.ID + 2, "time times", Task.TimeStart + "-" + Task.TimeStop)
                }
                break;
            case "notes":
                this.Notes = document.getElementById("item" + (this.ID + 4));
                this.Task.Notes = this.Notes.children[0].value;
                if (Task.Notes.length > 50)
                    this.Notes = modifyElement(this.ID, this.ID + 4, "notes", "<span title=\"" + this.Task.Notes + "\">" + Task.Notes.substring(0, 50) + "..." + "</span>");
                else if (Task.Notes.length < 1)
                    this.Notes = modifyElement(this.ID, this.ID + 4, "notes", "<span title=\"Antekningar\">Antekningar</span>");
                else
                    this.Notes = modifyElement(this.ID, this.ID + 4, "notes", "<span title=\"" + this.Task.Notes + "\">" + Task.Notes + "</span>");

                break;
        }

        saveTaskToDatabase(this.Task);
    }
}

/**Adds 0 at begining of input until is at length of 2 */
function dualInt(input) {

    while (input.length < 2) input = "0" + input;
    return input;
}

function saveTaskToDatabase(Task) {
    //TODO
}