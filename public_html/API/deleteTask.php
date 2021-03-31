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

$ID = filter_input(INPUT_POST, "ID", FILTER_VALIDATE_INT);

if (is_int($ID)) {
    $res = $db->query("DELETE FROM Tasks WHERE ID=$ID");
    if ($res != false) {
        printJSON([true]);
    } else {
        header("Content-Type: application/json; charset=UTF-8", true, 500);
        echo json_encode(["Internal server error" => "Unknown"]);
    }
} else {
    header("Content-Type: application/json; charset=UTF-8", true, 400);
    echo json_encode(["Bad indata" => "ID not int"]);
}
