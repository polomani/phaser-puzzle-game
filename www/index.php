<?php

$level = $_POST["level"];
$file = "levels.js";

if (!is_null($level) && strlen($level) > 2) {
	$cout = fopen($file, 'r');
	$data = "";
	if ($cout) {
	    while (($line = fgets($cout)) !== false) {
	        $data .= $line;
	    }
	    fclose($cout);
	    $data = substr($data, 0, -3);
	    $data .= ",\n\t" . $level . "\n];";
	    $cout = fopen($file, 'w');
		if ($cout) {
	    		fwrite($cout, $data);
	    		fclose($cout);
			echo ("ok");
		}
	}
}

?>