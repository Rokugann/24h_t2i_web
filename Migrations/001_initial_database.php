<?php
	require '../config/DBConnect.php';

	$dbh = new PDO('mysql:host=localhost;', "your_account", "your_password");
	$query = "CREATE USER "."'".$db_account."'@'localhost' IDENTIFIED WITH mysql_native_password BY"."'".$pass."'";
	$dbh->exec($query);

	$query = "CREATE DATABASE IF NOT EXISTS t2i_db";
	$dbh->exec($query);

	$query = "GRANT ALL PRIVILEGES ON `t2i\_db`.* TO"."'".$db_account."'"."@'localhost'; ALTER USER "."'".$db_account."'"."@'localhost' ; ";
	$dbh->exec($query);
?>