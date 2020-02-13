<?php

declare (strict_types=1);
require_once '../src/Err.php';
require_once '../src/printJson.php';

$duties = ["Slappat", "Kodat frontend", "Slötittat på YouTube", "Kodat backend", "Felsökt frontend", "Felsökt backend", "Kaffepaus", "Sökt information på nätet"];

$outdata = [];
for ($i = 0; $i < count($duties); $i++) {
    $outdata[] = ["id"=> $i, 
            "Name"=>$duties[$i]];
}

if (isset($_GET["fails"])) {
    $antal = filter_input(INPUT_GET, "fails", FILTER_VALIDATE_INT);
    $outdata = getErrors($antal);
}

printJSON($outdata);
