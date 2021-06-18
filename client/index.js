/* eslint-disable no-undef */

const videoElement = document.getElementById('video-element');
const message = document.getElementById('message');
const handle = document.getElementById('handle');
const roomForm = document.getElementById('room');
const chatForm = document.getElementById('chat-form');
const output = document.getElementById('output');
const feedback = document.getElementById('feedback');
const roomFeedback = document.getElementById('room-feedback');
const joinRoomButton = document.getElementById('join-room-button');

let roomIdServer;

const connectFunction = (e) => {
  e.preventDefault();
  const socket = io.connect('/');

  const roomId = e.target[0].value;
  socket.emit('roomId', roomId);

  videoElement.addEventListener('play', () => {
    socket.emit('play', {
      currentTime: videoElement.currentTime,
      roomId: roomIdServer,
    });
  });

  videoElement.addEventListener('pause', () =>
    socket.emit('pause', roomIdServer),
  );

  socket.on('roomId', (roomIdFromServer) => {
    roomIdServer = roomIdFromServer;
    roomFeedback.innerText = `You are connected to ${roomIdFromServer} Room`;
    joinRoomButton.disabled = true;
  });

  socket.on('pause', () => videoElement.pause());

  socket.on('play', (time) => {
    videoElement.currentTime = time;
    videoElement.play();
  });

  const form = document.getElementById('form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const url = event.target[0].value;
    socket.emit('movieUrl', { url, roomId: roomIdServer });
  });

  socket.on('movieUrl', (url) => {
    videoElement.src = url;
  });

  // Emit events
  chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    socket.emit('chat', {
      roomId: roomIdServer,
      message: {
        message: message.value,
        handle: handle.value,
      },
    });
    message.value = '';
  });

  message.addEventListener('keypress', () => {
    socket.emit('typing', { message: handle.value, roomId: roomIdServer });
  });

  // Listen for events
  socket.on('chat', (data) => {
    feedback.innerHTML = '';
    output.innerHTML += `<p><strong>${data.handle}: </strong>${data.message}</p>`;
  });

  socket.on('typing', (data) => {
    feedback.innerHTML = `<p><em>${data} is typing a message...</em></p>`;
  });
};

roomForm.addEventListener('submit', connectFunction);
