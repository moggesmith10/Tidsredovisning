
/**Creates a new element */
function createElement(parentID, elementId, classes, value) {
    document.getElementById("item" + parentID).innerHTML += " <span class=\"" + classes + " element\" id=\"item" + elementId + "\" onmousedown=onClick(" + elementId + ")>" + value + "</span>";
    return document.getElementById("item" + elementId);
}

/**Modifies an existing element, parentID is not used, but allows a createElement call to be copied and changed to a modifyElement
 * @parentID Unused, allows quick copy-paste of createElement();
 * @elementID element to change
 * @classes classes to set
 * @newValue new value for the element
*/
function modifyElement(parentID, elementId, classes, newValue) {
    document.getElementById("item" + elementId).outerHTML = "<span class=\"" + classes + " element\" id=\"item" + elementId + "\" onmousedown=onClick(" + elementId + ")>" + newValue + "</span>"
}

function removeElement(id) {
    document.getElementById("item" + id).remove();
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
