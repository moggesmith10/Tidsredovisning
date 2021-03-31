<?php

declare(strict_types=1);
require_once '../src/Err.php';
require_once '../src/printJson.php';

//Checks
$canRun = true;
error_reporting(E_STRICT);

try {
    $name = filter_input(INPUT_POST, "Name");
    if ($name != false) {
        $db = new SQLite3("../../not_public/Tidsredovisning.db");
        if (isset($_POST["ID"])) {
            $ID = filter_input(INPUT_POST, "ID", FILTER_VALIDATE_INT);
            if (is_int($ID)) {
                $res = $db->query($db->escapeString("UPDATE Duties SET Name=\"$name\" WHERE ID=$ID"));
                if($db->changes() > 0){
                    printJSON([true]);
                }
                else{
                    header("Content-Type: application/json; charset=UTF-8", true, 400);
                    echo json_encode(["Bad indata" => "Specified row does not exist"]);
                }
                if($res == false){
                    header("Content-Type: application/json; charset=UTF-8", true, 500);
                    echo json_encode(["Internal server error" => "Unknown"]);
                }
            } else {
                header("Content-Type: application/json; charset=UTF-8", true, 400);
                echo json_encode(["Bad indata" => "ID not int"]);
            }
        } else {
            $db->query($db->escapeString("INSERT INTO Duties(Name) VALUES (\"$name\")"));
            printJSON(["row" => $db->lastInsertRowID()]);
        }
    } else {
        header("Content-Type: application/json; charset=UTF-8", true, 400);
        echo json_encode(["Bad indata" => "No name found"]);
    }
} catch (Exception $e) {
    printJSON([var_dump($e)]);
    http_response_code(500);
}
