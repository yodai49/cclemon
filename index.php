<!DOCTYPE html>

<html lang="ja" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title></title>
    </head>

<body>

<?php
$newname=$_POST["newname"];
$newrating=$_POST["newrating"];
$newdate=$_POST["newdate"];
?>

<?php
$myfile = fopen("ranking.csv", "a")  //fileを上書きモードで開く
?>

<?php fwrite($myfile, $newname + "," + $newrating + "," + $newdate + "\n". "\n"); ?>

<?php
fclose($myfile);
?>

</body>
</html>