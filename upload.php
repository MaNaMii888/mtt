<?php
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "upload_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $description = $_POST["description"];

    $targetDir = "uploads/";
    $targetFile = $targetDir . basename($_FILES["image"]["name"]);
    $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

    if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile)) {
        $imageUrl = $targetFile;

        $stmt = $conn->prepare("INSERT INTO uploads (name, description, image_url) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $name, $description, $imageUrl);
        $stmt->execute();

        $stmt->close();
    } else {
        echo "Sorry, there was an error uploading your file.";
    }
}

$conn->close();
?>
