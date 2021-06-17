/* eslint-disable no-console */
require('dotenv').config();
const socket = require('socket.io');

const {
  env: { PORT },
} = process;
const app = require('./app');

const server = app.listen(PORT, () =>
  console.log(`server is connected @ http://localhost:${PORT}`),
);

const io = socket(server);
io.on('connection', (socketVariable) => {
  console.log('made socket connection', socketVariable.id);

  socketVariable.on('movieUrl', (url) => {
    console.log(url);
    io.sockets.emit('movieUrl', url);
  });

  // Handle typing event
  socketVariable.on('play', (data) => {
    io.sockets.emit('play', data);
  });

  // Handle typing event
  socketVariable.on('pause', () => {
    socketVariable.broadcast.emit('pause');
  });
});
