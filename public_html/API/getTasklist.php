<?php

declare(strict_types=1);
require_once '../src/Err.php';
require_once '../src/printJson.php';

try {
    $db = new SQLite3("../../not_public/Tidsredovisning.db");
} catch (Exception $e) {
    header("Content-Type: application/json; charset=UTF-8", true, 500);
    echo json_encode(["Internal server error" => "Could not connect to database"]);
}

if (isset($_POST["limitFrom"])) {
    $limitFrom = filter_input(INPUT_POST, "limitFrom", FILTER_VALIDATE_INT);
    if (is_int($limitFrom)) {
        $res = $db->query("SELECT ID, DutyID, Date, TimeStart, TimeStop, Notes FROM Tasks ORDER BY Date DESC LIMIT $limitFrom, 100");
    }
    else {
        header("Content-Type: application/json; charset=UTF-8", true, 400);
        echo json_encode(["Bad indata" => "limitFrom is set but not int"]);
    }
} else
    $res = $db->query("SELECT ID, DutyID, Date, TimeStart, TimeStop, Notes FROM Tasks ORDER BY Date DESC");

$arr = [];

while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
    foreach ($row as $key => $var) {
        if (is_null($var)) { //Ifall null
            $row[$key] = ""; //Gör till tom sträng
            if ($key == "DutyID") { //Ifall null och DutyID
                $row[$key] = "new"; //New ska användas istället för null
            }
        }
        if ($key == "Date") {
            $row[$key] = substr((string) $var, 0, 4) . "-" . substr((string) $var, 4, 2) . "-" . substr((string) $var, 6, 2);
        }
    }
    $arr[] = $row;
}

printJSON($arr);
