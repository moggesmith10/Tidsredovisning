<?php

require_once '../src/Err.php';
require_once '../src/printJson.php';

try {
    $db = new SQLite3("../../not_public/Tidsredovisning.db");
} catch (Exception $e) {
    header("Content-Type: application/json; charset=UTF-8", true, 500);
    echo json_encode(["Internal server error" => "Could not connect to database"]);
}

$variable = filter_input(INPUT_POST, "variable");
$newVal = filter_input(INPUT_POST, "newVal");


if (!(is_null($variable) || is_null($newVal))) {
    $res = $db->query($db->escapeString("UPDATE ProjectVariables SET $variable=\"$newVal\" WHERE ID = 1"));
    if ($res != false) {
        printJSON([true]);
    } else {
        header("Content-Type: application/json; charset=UTF-8", true, 500);
        echo json_encode(["Internal server error" => "Unknown"]);
    }
} else {
    header("Content-Type: application/json; charset=UTF-8", true, 400);
    echo json_encode(["Bad indata" => "variable or newVal is null"]);
}
