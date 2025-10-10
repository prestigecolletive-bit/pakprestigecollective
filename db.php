<?php
$servername = "localhost";   // or "127.0.0.1"
$username   = "root";        // default user in XAMPP
$password   = "";            // default password in XAMPP is empty
$dbname     = "prestige";      // replace with your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Connect to database
$conn = new mysqli("localhost", "root", "", "prestige_collective");
// Fetch products
Rsresult = Rsconn->query("SELECT * FROM products");
<?php
session_start();
Rscart_count = isset(RS_SESSION['cart_count']) ? Rs_SESSION['cart_count'] : 0;
?>
<a href="view_cart.php">🛒 Cart (<?php echo $cart_count; ?>)</a>



// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";

$conn->close();
while ($row = $result->fetch_assoc()) {
    echo "
    <div class='product'>
        <h3>{$row['name']}</h3>
        <p>Price: PKR {$row['price']}</p>
        <form method='POST' action='add_to_cart.php'>
            <input type='hidden' name='id' value='{$row['id']}'>
            <input type='hidden' name='name' value='{$row['name']}'>
            <input type='hidden' name='price' value='{$row['price']}'>
            <button type='submit'>Add to Cart</button>
        </form>
    </div>
    ";
}
?>
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
$mysqli = new mysqli('localhost','root','','prestige');
if ($mysqli->connect_errno) {
  http_response_code(500);
  echo 'Database connection failed: ' . $mysqli->connect_error;
  exit;
}
$mysqli->set_charset('utf8mb4');