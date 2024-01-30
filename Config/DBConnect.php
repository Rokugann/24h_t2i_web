<?php

$db_account = "t2i_special";
$pass = "sppdefcod1.?";

function DBConnect()
{
    global $db_account;
    global $pass;
    $dsn = 'mysql:host=localhost;';
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'
    ];

    // Edit the db_account and the pass to suit your own database account
    try {
        $dbh = new PDO($dsn, $db_account, $pass, $options);
        return $dbh;
        
    } catch (PDOException $e) {
        print "Erreur !: " . $e->getMessage() . "<br/>";
        die();
    }
}

function MyDBConnect()
{
    $dbh = DBConnect();
    $dbh->query("use t2i_db");

    return $dbh;
}