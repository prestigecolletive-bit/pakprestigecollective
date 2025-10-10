<?php
$servername = "localhost";   // or "127.0.0.1"
$username   = "root";        // default user in XAMPP
$password   = "";            // default password in XAMPP is empty
$dbname     = "prestige";      // replace with your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";

$conn->close();
?>
