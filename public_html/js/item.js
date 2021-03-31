function Item(Task) {
    this.Task = Task

    this.Task = defaultValues(this.Task);

    this.ID = lastID++;
    createListItem(this.ID, this.Task.ID);
    this.Duty = createElement(this.ID, lastID++, "duty", Duties[Task.DutyID].Name);
    this.Times = createElement(this.ID, lastID++, "time times", Task.TimeStart + "-" + Task.TimeStop)
    this.Dates = createElement(this.ID, lastID++, "time dates", Task.Date)

    //Adds trailing ... if needed
    if (Task.Notes != null) {
        if (Task.Notes.length > 90)
            this.Notes = createElement(this.ID, lastID++, "notes", "<span title=\"" + this.Task.Notes + "\">" + Task.Notes.substring(0, 90) + "..." + "</span>");
        else if (Task.Notes.length < 1)
            this.Notes = createElement(this.ID, lastID++, "notes", "<span title=\"Antekningar\">Antekningar</span>");
        else
            this.Notes = createElement(this.ID, lastID++, "notes", "<span title=\"" + this.Task.Notes + "\">" + Task.Notes + "</span>");
    }
    else {
        this.Notes = createElement(this.ID, lastID++, "notes", "<span title=\"Antekningar\">Antekningar</span>");
    }
    this.RemoveButton = createElement(this.ID, lastID++, "removeButton", "<button onmouseup=\"removeTask(" + this.ID + ")\">Ta bort</button>")


    //Gör till en input
    //Händer när man klickar på ett element
    this.setToModifyable = function (toModify) {
        switch (toModify) { //Kolla vad som ska modifieras
            case "duty":
                //Förbered en ny sträng med alla duties
                newString = "<select id=\"options" + this.ID + "\">" + Duties[this.Task.DutyID].Name
                Duties.forEach(element => {
                    if (Duties[this.Task.DutyID].Name == element.Name)
                        newString += "<option selected value=\"" + element.ID + "\">" + element.Name + "</option>";
                    else
                        newString += "<option value=\"" + element.ID + "\">" + element.Name + "</option>";
                });
                newString += "</select><button onclick=Items[" + this.ID / 6 + "].saveModifyable(\"duty\")>Spara</button>";

                //Printa ut
                modifyElement(this.ID, this.ID + 1, "duty", newString);
                addClass(this.ID + 1, "beingModified");
                break;
            case "time":
                //Förbered en ny sträng
                newString = "<input type=\"time\" value=\"" + this.Task.TimeStart + "\">-<input type=\"time\" value=\"" + this.Task.TimeStop + "\"><button onclick=Items[" + this.ID / 6 + "].saveModifyable(\"time\")>Spara</button>";
                //Printa ut
                modifyElement(this.ID, this.ID + 2, "time times", newString);
                addClass(this.ID + 2, "beingModified");
                break;
            case "date":
                //Förbered en ny sträng    
                newString = "<input type=\"date\" value=\"" + Task.Date + "\"><button onclick=Items[" + this.ID / 6 + "].saveModifyable(\"date\")>Spara</button>";
                //Printa ut
                modifyElement(this.ID, this.ID + 3, "time dates", newString);
                addClass(this.ID + 3, "beingModified");
                break;
            case "notes":
                //Förbered en ny sträng
                newString = "<textarea cols=100 rows=2>" + this.Task.Notes + "</textarea><button onclick=Items[" + this.ID / 6 + "].saveModifyable(\"notes\")>Spara</button>";
                //Printa ut
                modifyElement(this.ID, this.ID + 4, "notes", newString);
                addClass(this.ID + 4, "beingModified");
                break;
        }
    }

    //Sätt tillbaka till text och spara
    //Händer när man klickar på spara
    this.saveModifyable = function (toModify) {
        switch (toModify) {
            case "duty":
                this.DutyStr = document.getElementById("options" + this.ID)[document.getElementById("item" + (this.ID + 1)).children[0].selectedIndex].value;
                this.Task.DutyID = this.DutyStr;
                this.Duty = modifyElement(this.ID, this.ID + 1, "duty", Duties[Task.DutyID].Name);
                removeClass(this.ID, "hovering");
                break;
            case "date":
                this.Date = document.getElementById("item" + (this.ID + 3));
                this.dateNewVal = this.Date.children[0].value;
                this.dateNewValArr = this.dateNewVal.split("-");
                //TODO fix backend verification
                if (this.dateNewValArr[2] <= 31 && this.dateNewValArr[1] <= 12 && this.dateNewValArr[0] > 1970 && this.dateNewValArr[2] > 0 && this.dateNewValArr[1] > 0) {
                    this.Task.Date = this.Date.children[0].value;
                    this.Dates = modifyElement(this.ID, this.ID + 3, "time dates", this.Task.Date); 
                }
                else {
                    alert("Ogiltigt format")
                }
                
                break;
            case "time":
                this.newTimeArr =
                    [document.getElementById("item" + (this.ID + 2)).children[0].value,
                    document.getElementById("item" + (this.ID + 2)).children[1].value]
                canRun = true;
                for (i = 0; i < 2; i++) {
                    if (!(this.newTimeArr[i].split(":")[0] < 24 && this.newTimeArr[i].split(":")[1] < 60)) canRun = false;
                }

                //Dont run incase the first value is bigger than the second. I.e. 20:30-13:30 = not ok
                if ((this.newTimeArr[0].split(":")[0] > this.newTimeArr[1].split(":")[0]) ||                                                                            // Are the hours wrong or...
                    this.newTimeArr[0].split(":")[0] == this.newTimeArr[1].split(":")[0] && this.newTimeArr[0].split(":")[1] > this.newTimeArr[1].split(":")[1]) {      //Are the hours the same and minutes wrong
                    alert("Start tiden kan inte vara större än slut tiden")
                    canRun = false;
                }

                if (canRun) {
                    //Adds starting zeroes
                    this.Task.TimeStart = dualInt(this.newTimeArr[0].split(":")[0]) + ":" + dualInt(this.newTimeArr[0].split(":")[1]);
                    this.Task.TimeStop = dualInt(this.newTimeArr[1].split(":")[0]) + ":" + dualInt(this.newTimeArr[1].split(":")[1]);
                }
                this.Times = modifyElement(this.ID, this.ID + 2, "time times", Task.TimeStart + "-" + Task.TimeStop)
                break;
            case "notes":
                this.Notes = document.getElementById("item" + (this.ID + 4));
                this.Task.Notes = this.Notes.children[0].value;
                if (Task.Notes.length > 90)
                    this.Notes = modifyElement(this.ID, this.ID + 4, "notes", "<span title=\"" + this.Task.Notes + "\">" + Task.Notes.substring(0, 90) + "..." + "</span>");
                else if (Task.Notes.length < 1)
                    this.Notes = modifyElement(this.ID, this.ID + 4, "notes", "<span title=\"Antekningar\">Antekningar</span>");
                else
                    this.Notes = modifyElement(this.ID, this.ID + 4, "notes", "<span title=\"" + this.Task.Notes + "\">" + Task.Notes + "</span>");
                break;
        }

        saveTaskToDatabase(this.Task);
    }
}