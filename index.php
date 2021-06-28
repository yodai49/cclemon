<?php
$twrite=$_POST["twrite"];
$myfile = fopen("https://yodai49.github.io/cclemon/ranking.csv", "a");  //fileを上書きモードで開く
fwrite($myfile, $twrite);
fclose($myfile);
?>
