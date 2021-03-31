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

printJSON($db->query("SELECT * FROM ProjectVariables")->fetchArray(SQLITE3_ASSOC));     //Få en assoc av första raden i ProjectVariables
                                                                                        //Borde aldrig vara mer än en rad
