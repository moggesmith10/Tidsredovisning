function univLoad() {
    let univRequest = new XMLHttpRequest();
    univRequest.open("GET", "API/getProjectVariables.php", true);
    univRequest.onload = function () {
        settings = JSON.parse(this.response);
        run(settings);
    }
    univRequest.send();
}
function run(settings) {
    //Sätt namnet på projektet
    document.getElementById("title").innerHTML = settings["ProjectName"];
}