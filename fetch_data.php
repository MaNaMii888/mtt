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

    $stmt = $conn->prepare("INSERT INTO uploads (name, description) VALUES (?, ?)");
    $stmt->bind_param("ss", $name, $description);
    $stmt->execute();
    $upload_id = $stmt->insert_id;
    $stmt->close();

    $targetDir = "uploads/";

    foreach ($_FILES["images"]["name"] as $key => $name) {
        $targetFile = $targetDir . basename($name);
        $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

        if (move_uploaded_file($_FILES["images"]["tmp_name"][$key], $targetFile)) {
            $imageUrl = $targetFile;

            $stmt = $conn->prepare("INSERT INTO images (upload_id, image_url) VALUES (?, ?)");
            $stmt->bind_param("is", $upload_id, $imageUrl);
            $stmt->execute();
            $stmt->close();
        } else {
            echo "Sorry, there was an error uploading your file.";
        }
    }
}

$conn->close();
?>
