const express = require('express');
const { join } = require('path');

const app = express();

// app.use(express.static('client'));
// app.all('*', (req, res) => {
//   res.sendFile(join(__dirname, 'client/build/', 'index.html'));
// });

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'client', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'client', 'build', 'index.html'));
  });
}

// enabling access control origin
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With, Content-Type, Accept',
  );
  next();
});

module.exports = app;
