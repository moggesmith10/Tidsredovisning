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

if (isset($_GET["ID"])) {
    $ID = filter_input(INPUT_GET, "ID", FILTER_VALIDATE_INT);
    if (is_int($ID)) {
        $res = $db->query("SELECT * FROM Duties WHERE ID=" . $ID);
        printJSON($res->fetchArray(SQLITE3_ASSOC));
    }
    else{
        header("Content-Type: application/json; charset=UTF-8", true, 400);
        echo json_encode(["Bad indata" => "ID set but not int"]);
    }
} else {
    header("Content-Type: application/json; charset=UTF-8", true, 400);
    echo json_encode(["Bad indata" => "No ID in get"]);
}
