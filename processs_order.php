<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "prestige";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("DB Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $customer_name = $_POST['customer_name'];
    $address = $_POST['address'];
    $contact_no = $_POST['contact_no'];
    $products = $_POST['products'];

    $sql = "INSERT INTO orders (customer_name, product_name, address, contact_no) 
            VALUES ('$customer_name', '$products', '$address', '$contact_no')";

    if ($conn->query($sql) === TRUE) {
        header("Location: order_success.html");
        exit();
    } else {
        echo "Error: " . $conn->error;
    }
}
$conn->close();
?>
<?php
require __DIR__.'/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo 'Method Not Allowed';
  exit;
}

$customer_name = trim($_POST['customer_name'] ?? '');
$address       = trim($_POST['address'] ?? '');
$contact_no    = trim($_POST['contact_no'] ?? '');
$order_json    = $_POST['order_json'] ?? '[]';
$order_total   = floatval($_POST['order_total'] ?? 0);

$items = json_decode($order_json, true);
if (!$customer_name || !$address || !$contact_no || !is_array($items) || !count($items)) {
  echo 'Missing required fields or cart is empty.';
  exit;
}

/* Build product_name string to match your table design */
$products = [];
foreach ($items as $it) {
  $name = $mysqli->real_escape_string($it['name'] ?? 'Item');
  $qty  = intval($it['qty'] ?? 1);
  $products[] = "$name x$qty";
}
$product_name_str = implode(', ', $products);

/* Prepared statement to avoid SQL injection */
$stmt = $mysqli->prepare(
  "INSERT INTO orders (customer_name, product_name, address, contact_no, order_total)
   VALUES (?, ?, ?, ?, ?)"
);
$stmt->bind_param('ssssd', $customer_name, $product_name_str, $address, $contact_no, $order_total);

if ($stmt->execute()) {
  header('Location: order_success.html');
  exit;
}
echo 'DB Error: ' . $mysqli->error;
<?php
$conn = new mysqli("localhost", "root", "", "prestige");
if ($conn->connect_error) die("DB connection failed");

$customer = $_POST['customer_name'];
$address = $_POST['address'];
$contact = $_POST['contact_no'];
$order_json = $_POST['order_json'];
$total = $_POST['order_total'];

$stmt = $conn->prepare("INSERT INTO orders (customer_name, product_name, address, contact_no, order_total) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("ssssd", $customer, $order_json, $address, $contact, $total);
$stmt->execute();

header("Location: order_success.html");
exit;