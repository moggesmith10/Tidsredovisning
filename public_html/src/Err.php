<?php

declare (strict_types=1);

function getErrors(int $antal): array {
    $errors = ["Unexpected", "Invalid indata", "Solen i ögonen", "Syntax error", "Bad connection", "Network failure"];
    for ($i = 0; $i < $antal; $i++) {
        $e = random_int(0, count($errors));
        $outdata[]= ["errormsg"=> $errors[$e], 
                "errorid"=>$e];
    }
    return $outdata;
}
