const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const jsonParser = express.json();

const port = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, '../dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');

const FILE_PATHS = ['./models/data.json', './models/names.json'];

app.use(express.static(DIST_DIR));

app.get('/api', (req, res) => {
    const dbData = FILE_PATHS.map((filePath) => JSON.parse(fs.readFileSync(filePath, 'utf-8')));

    res.send(dbData);
});

app.post('/api/shop-cart', jsonParser, (req, res) => {
    if (!req.body) {
        return res.sendStatus(400);
    }

    const data = JSON.parse(fs.readFileSync(FILE_PATHS[0], 'utf8'));

    data.Value.Goods = req.body;

    fs.writeFileSync(FILE_PATHS[0], JSON.stringify(data));

    res.sendStatus(200);
});

app.get('/', (req, res) => {
    res.sendFile(HTML_FILE);
});

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});
