/* eslint-disable no-undef */
const socket = io.connect('/');
const videoElement = document.getElementById('video-element');

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
  console.log(e);
  const url = e.target[0].value;
  socket.emit('movieUrl', url);
});

socket.on('movieUrl', (url) => {
  console.log(url);
  videoElement.src = url;
});
