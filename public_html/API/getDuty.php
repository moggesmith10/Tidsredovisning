<?php

declare (strict_types=1);
require_once '../src/Err.php';
require_once '../src/printJson.php';
if (isset($_GET["id"])) {
    $id = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);
    $outdata[] = ["id" => $id,
        "uppgift" => "Slappat",
    ];
}else {
    header("Content-Type: application/json; charset=UTF-8", true, 400);
    echo json_encode(["Bad indata" => "Invalid GET (no id)"]);
    exit;
}

if (isset($_GET["fails"])) {
    $antal = filter_input(INPUT_GET, "fails", FILTER_VALIDATE_INT);
    $outdata = getErrors($antal);
}

printJSON($outdata);
