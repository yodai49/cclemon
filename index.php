<?php
$twrite=$_POST["twrite"];
$myfile = fopen("ranking.csv", "a");  //fileを上書きモードで開く
fwrite($myfile, $twrite);
fclose($myfile);
?>
