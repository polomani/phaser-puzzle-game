<?php
header('Access-Control-Allow-Origin: *');
$level = $_POST["level"];
$pass = $_POST["pass"];

if (!is_null($level) && strlen($level) > 2 && $pass=="korleone") {
	rename ("levels.js", "levels-".time().".js");
	$file = "levels.js";
	$cout = fopen($file, 'w');
	if ($cout) {
	    fwrite($cout, $level);
	    fclose($cout);
		echo ("ok");
	}
}

?>