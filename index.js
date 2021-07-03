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

io.on('connection', (req) => {
  req.on('disconnecting', () => {
    const roomId = [...req.rooms].find((item) => item !== req.id);
    req.leave(roomId);
    const connectedUsers = io.sockets.adapter.rooms?.get(roomId)?.size || 1;
    io.to(roomId).emit('roomId', { roomId, connectedUsers });
    io.to(roomId).emit('peer-disconnect', { peerId: req.peerId });
  });

  req.on('join-room', ({ roomId, loadedData, nickname }) => {
    // check roomId - should be in rooms

    if (!io.sockets.adapter.rooms.get(roomId)) return;
    req.join(roomId);
    const connectedUsers = io.sockets.adapter.rooms?.get(roomId)?.size || 1;
    req.loadedData = loadedData;
    req.nickname = nickname;
    const loadDataUsers = [...io.sockets.sockets].filter(
      (item) =>
        io.sockets.adapter.rooms.get(roomId).has(item[0]) && item[1].loadedData,
    ).length;
    io.to(roomId).emit('roomId', {
      roomId,
      connectedUsers,
      loadedData,
      id: req.id,
      loadDataUsers,
    });
  });

  req.on('create-room', ({ loadedData, nickname }) => {
    const roomId = `${req.id}_${Math.random().toFixed(3)}`;
    req.join(roomId);
    const connectedUsers = io.sockets.adapter.rooms?.get(roomId)?.size || 1;
    req.loadedData = loadedData;
    req.nickname = nickname;
    const loadDataUsers = [...io.sockets.sockets].filter(
      (item) =>
        io.sockets.adapter.rooms.get(roomId).has(item[0]) && item[1].loadedData,
    ).length;
    io.to(roomId).emit('roomId', {
      roomId,
      connectedUsers,
      loadedData,
      id: req.id,
      loadDataUsers,
    });
  });

  req.on('peer-connected', ({ peerId }) => {
    req.peerId = peerId || req.peerId;
  });

  req.on('call-peers', ({ roomId }, callback) => {
    const peersId = [...io.sockets.sockets]
      .filter((item) => io.sockets.adapter.rooms.get(roomId).has(item[0]))
      .map((item) => item[1].peerId);
    callback({ [roomId]: peersId });
    // req.to(roomId).emit('peers', { peersId });
    // req.to(roomId).emit('call-other-room-members');
  });

  req.on('loadeddata', ({ roomId, loadedData }) => {
    req.loadedData = loadedData;
    const loadDataUsers = [...io.sockets.sockets].filter(
      (item) =>
        io.sockets.adapter.rooms.get(roomId).has(item[0]) && item[1].loadedData,
    ).length;

    io.to(roomId).emit('loadeddata', {
      id: req.id,
      loadedData,
      loadDataUsers,
    });
  });

  req.on('timeUpdated', ({ roomId, currentTime }) => {
    req.currentTime = currentTime;
    const usersNickNames = [...io.sockets.sockets]
      .filter((item) => io.sockets.adapter.rooms.get(roomId).has(item[0]))
      .map((item) => ({
        nickname: item[1].nickname,
        currentTime: item[1].currentTime,
      }));
    io.to(roomId).emit('timeUpdated', {
      id: req.id,
      currentTime,
      usersNickNames,
    });
  });

  req.on('movieUrl', (data) => {
    io.sockets.sockets.forEach((socketItem) => {
      socketItem.loadedData = false;
    });
    req.to(data.roomId).emit('movieUrl', data.url);
  });

  //
  req.on('seeked', ({ time, roomId }) => {
    req.to(roomId).emit('seeked', { time });
  });

  // Handle typing event
  req.on('play', (data) => {
    req.to(data.roomId).emit('play', {
      time: data.currentTime,
      nickname: req.nickname,
    });
  });

  // Handle typing event
  req.on('pause', (roomId) => {
    req.to(roomId).emit('pause', { nickname: req.nickname });
  });

  // Handle chat event
  req.on('chat', (data) => {
    req.to(data.roomId).emit('chat', data.message);
  });

  // Handle typing event
  req.on('typing', (data) => {
    req.to(data.roomId).emit('typing', data.message);
  });
});
