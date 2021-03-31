<?php

declare(strict_types=1);
require_once '../src/Err.php';
require_once '../src/printJson.php';

$db = new SQLite3("../../not_public/Tidsredovisning.db");

if (isset($_POST["new"])) {
    $db->query("INSERT INTO Tasks DEFAULT VALUES");
    printJSON(["ID" => $db->lastInsertRowID()]);
} else {
    $task = [];
    $task["TaskID"] = filter_input(INPUT_POST, "TaskID", FILTER_VALIDATE_INT);
    $task["DutyID"] = filter_input(INPUT_POST, "DutyID", FILTER_VALIDATE_INT);
    $task["TimeStart"] = filter_input(INPUT_POST, "TimeStart");
    $task["TimeStop"] = filter_input(INPUT_POST, "TimeStop");
    $task["Notes"] = filter_input(INPUT_POST, "Notes");
    $task["Date"] = filter_input(INPUT_POST, "Date");

    if (is_int($task["TaskID"])) {

        if ($task["Date"] != null) {
            $task["Date"] = preg_split("/-/", $task["Date"])[0] . preg_split("/-/", $task["Date"])[1] . preg_split("/-/", $task["Date"])[2]; //Ta bort - mellan datum-värden
        }
        $res = $db->query($db->escapeString("UPDATE Tasks SET DutyID=\"$task[DutyID]\", TimeStart=\"$task[TimeStart]\", TimeStop=\"$task[TimeStop]\", Notes=\"$task[Notes]\", Date=\"$task[Date]\" WHERE ID=$task[TaskID]"));
        printJSON([$res]);
    }
    else{
        header("Content-Type: application/json; charset=UTF-8", true, 400);
        echo json_encode(["Bad indata" => "TaskID not set"]);
    }
}
