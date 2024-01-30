<?php
	require '../config/DBConnect.php';

	$dbh = MyDBConnect();
	$query = "CREATE TABLE IF NOT EXISTS users (
		id int PRIMARY KEY,
		name varchar(80) NOT NULL,
		surname varchar(80) NOT NULL,
		birth_date date NOT NULL,
		address text NULL,
		email varchar(80) NOT NULL UNIQUE,
		phone varchar(30) NOT NULL UNIQUE
	)";

	$dbh->exec($query);
?>