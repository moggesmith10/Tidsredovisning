<?php

mb_internal_encoding("UTF-8");

include "../not_public/db.php";
$mysql = new mysqli($host, $username, $password, $database);

$mysql->set_charset("utf8");

$duties = [];
$result = $mysql->query("SELECT ID, Name FROM duties");

while ($row = $result->fetch_assoc()) {
    $duties[] = $row;
}

$result = $mysql->query("SELECT * FROM tasks");

$tasks = [];

while ($row = $result->fetch_assoc()) {
    $tasks[] = $row;
}

?>
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Tidsredovisning</title>
    <link href="css/main.css" rel="stylesheet">
    <script src="js/js.js"></script>
    <script>
        duties = [<?= json_encode($duties) ?>][0]
        tasks = [<?= json_encode($tasks) ?>][0]
        currentOpen = null;
    </script>

</head>

<body onload="loadTasks()" >

    <header>
        <h1><?= getProjectName($mysql) ?></h1>
        <div class="header_button"><a>Inställningar</a></div>
        <div class="header_button"><a>Statistik</a></div>
    </header>
    <main>
        <div class="list" id="list"></div>
    </main>
</body>

</html>

<?php

function getProjectName($mysql){
    return $mysql->query("SELECT * FROM settings")->fetch_assoc()["ProjectName"];
}