<?php

declare (strict_types=1);
require_once '../src/Err.php';
require_once '../src/printJson.php';

// Uppdatera eller spara ny post?
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_GET["id"])) {
        $outdata[] = "true";
    } else {
        $outdata[] = ["id" => 27];
    }
} else {
    header("Content-Type: application/json; charset=UTF-8", true, 405);
    echo json_encode(["Method not allowed" => "Missing POST-data"]);
    exit;
}

if (isset($_GET["fails"])) {
    $antal = filter_input(INPUT_GET, "fails", FILTER_VALIDATE_INT);
    $outdata = getErrors($antal);
}

printJSON($outdata);
