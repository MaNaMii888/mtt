// server.js

const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Handle image uploads
app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        // Resize and compress image using sharp
        sharp(req.file.path)
            .resize({ width: 200, height: 200 })
            .toFile(`uploads/compressed_${req.file.filename}`, (err, info) => {
                if (err) throw err;
                // Delete original uploaded image
                fs.unlinkSync(req.file.path);
                res.json({ success: true, message: 'Image uploaded successfully' });
            });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error uploading image' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
