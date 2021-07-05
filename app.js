const express = require('express');
const { join } = require('path');

const app = express();

app.use(express.static('client'));
app.all('*', (req, res) => {
  res.sendFile(join(__dirname, 'client', 'index.html'));
});

module.exports = app;
