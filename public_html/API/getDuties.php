
<?php

require_once '../src/Err.php';
require_once '../src/printJson.php';

try {
    $db = new SQLite3("../../not_public/Tidsredovisning.db");
} catch (Exception $e) {
    header("Content-Type: application/json; charset=UTF-8", true, 500);
    echo json_encode(["Internal server error" => "Could not connect to database"]);
}

$res = $db->query("SELECT * FROM Duties");

$arr = [];

while($row = $res->fetchArray(SQLITE3_ASSOC)){ //Loopa genom resultat och plocka fram en assoc array
    $arr[] = $row;
}

printJSON($arr);