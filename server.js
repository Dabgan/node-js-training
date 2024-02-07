const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;

app.get(`^/$|index.html`, (req, res) => {
    res.sendFile('./views/index.html', { root: __dirname });
});

app.get('/new-page.html', (req, res) => {
    res.sendFile('./views/new-page.html', { root: __dirname });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
