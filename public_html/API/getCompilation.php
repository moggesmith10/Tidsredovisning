<?php

declare (strict_types=1);
require_once '../src/Err.php';
require_once '../src/printJson.php';

$duties = ["Slappat", "Kodat frontend", "Slötittat på YouTube", "Kodat backend", "Felsökt frontend", "Felsökt backend", "Kaffepaus", "Sökt information på nätet"];

if (isset($_GET["from"]) && isset($_GET["to"])) {
    for ($i = 0; $i < count($duties); $i++) {
        $rnd = random_int(0, count($duties) - 1);
        $outdata[] = ["uppgift" => $duties[$i],
            "Duty" => $rnd,
            "Date" => date("d-m-Y"),
            "TimeStart" => date("H:s"),
            "TimeStop" => date("H:s"),
            "Notes" => "here b a lto of teh notie s he ho ha hep hp and teher be oveerfluw and shtufz",
            "Status" => 0
        ];
    }
}else {
    header("Content-Type: application/json; charset=UTF-8", true, 400);
    echo json_encode(["Bad indata" => "Invalid GET (no to and from)"]);
    exit;
}


if (isset($_GET["fails"])) {
    $antal = filter_input(INPUT_GET, "fails", FILTER_VALIDATE_INT);
    $outdata = getErrors($antal);
}

printJSON($outdata);
