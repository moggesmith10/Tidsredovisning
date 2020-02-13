<?php

declare (strict_types=1);
require_once '../src/Err.php';
require_once '../src/printJson.php';

$duties = ["Slappat", "Kodat frontend", "Slötittat på YouTube", "Kodat backend", "Felsökt frontend", "Felsökt backend", "Kaffepaus", "Sökt information på nätet"];

if (isset($_GET["page"])) {
    $sida = filter_input(INPUT_GET, "page", FILTER_VALIDATE_INT);
    $outdata[] = ["sida" => $sida];
        for ($i = 1; $i < 21; $i++) {
        $postnr = 20 * ($sida - 1) + $i;
        $rnd = random_int(0, count($duties) - 1);
        $outdata[] = ["postnr" => $postnr , 
            "id" => $i,
            "start" => date("Y-m-d H:i", strtotime("3 hours $i days ago")),
            "slut" => date("Y-m-d H:i", strtotime("1 hours $i days ago")),
            "uppgift" => $duties[$rnd],
            "uppgiftid" => $rnd,
            "tid" => 1,  ];
    }
} elseif (isset($_GET["to"]) && isset($_GET["from"])) {
    for ($i = 1; $i < 21; $i++) {
        $postnr =  $i;
        $rnd = random_int(0, count($duties) - 1);
        $outdata[] = ["postnr" => $postnr,
            "id" => $i,
            "start" => date("Y-m-d H:i", strtotime("3 hours $i days ago")),
            "slut" => date("Y-m-d H:i", strtotime("2 hours $i days ago")),
            "uppgift" => $duties[$rnd],
            "uppgiftid" => $rnd,
            "tid" => 1,
        ];
    }
} else {
    header("Content-Type: application/json; charset=UTF-8", true, 400);
    echo json_encode(["Bad indata" => "Invalid GET (no page OR to and from)"]);
    exit;
}

if (isset($_GET["fails"])) {
    $antal = filter_input(INPUT_GET, "fails", FILTER_VALIDATE_INT);
    $outdata = getErrors($antal);
}

printJSON($outdata);
