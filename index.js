/* eslint-disable no-param-reassign */
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
  socketVariable.on('disconnecting', () => {
    const roomId = [...socketVariable.rooms].find(
      (item) => item !== socketVariable.id,
    );
    socketVariable.leave(roomId);
    const connectedUsers = io.sockets.adapter.rooms?.get(roomId)?.size || 1;
    io.to(roomId).emit('roomId', { roomId, connectedUsers });
  });

  socketVariable.on('join-room', ({ roomId, loadedData }) => {
    socketVariable.join(roomId);
    const connectedUsers = io.sockets.adapter.rooms?.get(roomId)?.size || 1;
    socketVariable.loadedData = loadedData;
    const loadDataUsers = [...io.sockets.sockets].filter(
      (item) => item[1].loadedData,
    ).length;
    io.to(roomId).emit('roomId', {
      roomId,
      connectedUsers,
      loadedData,
      id: socketVariable.id,
      loadDataUsers,
    });
  });

  socketVariable.on('create-room', ({ loadedData }) => {
    const roomId = `${socketVariable.id}+${Math.random().toFixed(3)}`;
    socketVariable.join(roomId);
    const connectedUsers = io.sockets.adapter.rooms?.get(roomId)?.size || 1;
    socketVariable.loadedData = loadedData;
    const loadDataUsers = [...io.sockets.sockets].filter(
      (item) => item[1].loadedData,
    ).length;
    io.to(roomId).emit('roomId', {
      roomId,
      connectedUsers,
      loadedData,
      id: socketVariable.id,
      loadDataUsers,
    });
  });

  socketVariable.on('loadeddata', ({ roomId, loadedData }) => {
    socketVariable.loadedData = loadedData;
    const loadDataUsers = [...io.sockets.sockets].filter(
      (item) => item[1].loadedData,
    ).length;

    console.log('loadDataUsers', loadDataUsers);

    io.to(roomId).emit('loadeddata', {
      id: socketVariable.id,
      loadedData,
      loadDataUsers,
    });
  });

  socketVariable.on('movieUrl', (data) => {
    io.sockets.sockets.forEach((socketItem) => {
      socketItem.loadedData = false;
    });
    socketVariable.to(data.roomId).emit('movieUrl', data.url);
  });

  //
  socketVariable.on('seeked', ({ time, roomId }) => {
    socketVariable.to(roomId).emit('seeked', { time });
  });

  // Handle typing event
  socketVariable.on('play', (data) => {
    socketVariable.to(data.roomId).emit('play', data.currentTime);
  });

  // Handle typing event
  socketVariable.on('pause', (roomId) => {
    socketVariable.to(roomId).emit('pause');
  });

  // Handle chat event
  socketVariable.on('chat', (data) => {
    socketVariable.to(data.roomId).emit('chat', data.message);
  });

  // Handle typing event
  socketVariable.on('typing', (data) => {
    socketVariable.to(data.roomId).emit('typing', data.message);
  });
});
