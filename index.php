<?php
$newname=$_POST["newname"];
$newrating=$_POST["newrating"];
$newdate=$_POST["newdate"];
$myfile = fopen("ranking.csv", "a");  //fileを上書きモードで開く
fwrite($myfile, "debug1,debug2,debug3 \n". "\n");
fclose($myfile);
$alert = "<script type='text/javascript'>alert('aaa');</script>";
echo $alert;
?>
