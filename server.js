const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000; // Use port 3000 by default

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for serving the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, '8.8.8.8', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
