<?php
declare (strict_types=1);

function printJSON(array $out):void {
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode($out, JSON_PRETTY_PRINT);
}