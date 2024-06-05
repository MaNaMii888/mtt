const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

let data = []; // This will store our uploaded data

app.post('/upload', (req, res) => {
    const newData = req.body;
    data.push(newData);
    res.json({ message: 'Data uploaded successfully' });
});

app.get('/data', (req, res) => {
    res.json(data);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
