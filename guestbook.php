<?php
  if (isset($_POST['submit'])) {
    // Connect to the database
    $conn = mysqli_connect('host', 'username', 'password', 'database');
    // Escape user inputs for security
    $name = mysqli_real_escape_string($conn, $_POST['name']);
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $message = mysqli_real_escape_string($conn, $_POST['message']);
    $date = date("Y-m-d H:i:s");
    // Attempt insert query execution
    $sql = "INSERT INTO guestbook (name, email, message, date) VALUES ('$name', '$email', '$message', '$date')";
    if(mysqli_query($conn, $sql)){
        echo "Records added successfully.";
    } else{
        echo "ERROR: Could not able to execute $sql. " . mysqli_error($conn);
    }
    // Close connection
    mysqli_close($conn);
    header("Location: guestbook.php");
?>
<!DOCTYPE html>
<html>
<head>
  <title>Guestbook</title>

<style>
.container {
  width: 50%;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 40px;
}

form {
  text-align: center;
  margin-bottom: 40px;
}

label {
  display: block;
  margin-bottom: 10px;
  font-size: 18px;
}

input[type="text"], input[type="email"], textarea {
  width: 100%;
  padding: 12px 20px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  resize: vertical;
}

input[type="submit"] {
  background-color: #4CAF50;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

input[type="submit"]:hover {
  background-color: #45a049;
}

.entry {
  border-bottom: 1px solid #ccc;
  padding: 20px 0;
}

.entry h2 {
  margin-bottom: 5px;
}

.entry p {
  margin-bottom: 10px;
font-size: 16px;
}

</head>
<body>
  <div class="container">
    <h1>Guestbook</h1>
    <form action="guestbook.php" method="post">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" required>

      <label for="email">Email:</label>
      <input type="email" id="email" name="email">

      <label for="message">Message:</label>
      <textarea id="message" name="message" required></textarea>

      <input type="submit" value="Add Entry">
    </form>

    <?php
      // Connect to the database
      $conn = mysqli_connect('host', 'username', 'password', 'database');
      // Retrieve all entries from the database
      $result = mysqli_query($conn, "SELECT * FROM guestbook ORDER BY id DESC");
      while ($row = mysqli_fetch_array($result)) {
        echo "<div class='entry'>";
        echo "<h2>" . $row['name'] . "</h2>";
        echo "<p>" . $row['email'] . "</p>";
        echo "<p>" . $row['message'] . "</p>";
        echo "<p>Date: " . $row['date'] . "</p>";
        echo "</div>";
      }
      mysqli_close($conn);
    ?>
  </div>
<br />
<a href="https://php.org" title="PHP tutorials">Powered by PHP.org</a>
</body>
</html>