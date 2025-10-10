<?php
session_start();

// Connect to database
$conn = new mysqli("localhost", "root", "", "prestige_collective");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = $_POST['id'];
    $name = $_POST['name'];
    $price = $_POST['price'];

    // Check if product already exists in cart
    $check = $conn->query("SELECT * FROM cart WHERE product_id='$id'");
    if ($check->num_rows > 0) {
        // Update quantity
        $conn->query("UPDATE cart SET quantity = quantity + 1 WHERE product_id='$id'");
    } else {
        // Insert new
        $conn->query("INSERT INTO cart (product_id, product_name, price, quantity) VALUES ('$id', '$name', '$price', 1)");
    }

    // Store count in session
    $count = $conn->query("SELECT SUM(quantity) as total FROM cart")->fetch_assoc()['total'];
    $_SESSION['cart_count'] = $count;

    header("Location: index.php"); // Redirect back
    exit();
}
?>
<?php
$conn = new mysqli("localhost", "root", "", "prestige_collective");
$result = $conn->query("SELECT * FROM cart");

echo "<h2>Your Cart</h2>";
echo "<table border='1'><tr><th>Name</th><th>Price</th><th>Qty</th><th>Total</th></tr>";

while ($row = $result->fetch_assoc()) {
    $total = $row['price'] * $row['quantity'];
    echo "<tr>
        <td>{$row['product_name']}</td>
        <td>PKR {$row['price']}</td>
        <td>{$row['quantity']}</td>
        <td>PKR {$total}</td>
    </tr>";
}
echo "</table>";
?>
