<?php
$twrite=$_GET["twrite"];
$myfile = fopen("https://yodai49.github.io/cclemon/ranking.csv", "a");  //fileを上書きモードで開く
fwrite($myfile, $twrite);
fwrite($myfile,"aaaaanoa");
fclose($myfile);
?>
