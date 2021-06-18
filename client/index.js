/* eslint-disable no-undef */
const socket = io.connect('/');
const videoElement = document.getElementById('video-element');
const message = document.getElementById('message');
const handle = document.getElementById('handle');
const btn = document.getElementById('send');
const output = document.getElementById('output');
const feedback = document.getElementById('feedback');

videoElement.addEventListener('play', () => {
  socket.emit('play', videoElement.currentTime);
});

videoElement.addEventListener('pause', () => socket.emit('pause'));

socket.on('pause', () => videoElement.pause());
socket.on('play', (time) => {
  videoElement.currentTime = time;
  videoElement.play();
});

const form = document.getElementById('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const url = e.target[0].value;
  socket.emit('movieUrl', url);
});

socket.on('movieUrl', (url) => {
  videoElement.src = url;
});

// Emit events
btn.addEventListener('click', () => {
  socket.emit('chat', {
    message: message.value,
    handle: handle.value,
  });
  message.value = '';
});

message.addEventListener('keypress', () => {
  socket.emit('typing', handle.value);
});

// Listen for events
socket.on('chat', (data) => {
  feedback.innerHTML = '';
  output.innerHTML += `<p><strong>${data.handle}: </strong>${data.message}</p>`;
});

socket.on('typing', (data) => {
  feedback.innerHTML = `<p><em>${data} is typing a message...</em></p>`;
});
