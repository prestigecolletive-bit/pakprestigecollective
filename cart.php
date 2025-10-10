<?php
session_start();

if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $product = $_POST['product_name'];
    $_SESSION['cart'][] = $product;
}

header("Location: cart.html");
exit();
?>