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
const connectedPeople = document.getElementById('connected-people');
const form = document.getElementById('form');
const videoTime = document.getElementById('video-time');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const expandIcon = document.getElementById('expand-icon');
const compressIcon = document.getElementById('compress-icon');

// videoElement.removeAttribute('controls');
//

const playButton = document.getElementById('play-button');
const fullScreen = document.getElementById('full-screen');

const seekBar = document.getElementById('seek-bar');

fullScreen.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    expandIcon.classList.add('hidden');
    compressIcon.classList.remove('hidden');
  } else {
    expandIcon.classList.remove('hidden');
    compressIcon.classList.add('hidden');
  }

  return document.fullscreenElement
    ? document.exitFullscreen()
    : document.documentElement.requestFullscreen();
});

//
let roomIdServer;

const connectFunction = (e) => {
  e.preventDefault();
  const socket = io.connect('/');

  const roomId = e.target[0].value;
  socket.emit('roomId', roomId);

  // actions

  // press play
  playButton.addEventListener('click', () => {
    playIcon.classList.toggle('hidden');
    pauseIcon.classList.toggle('hidden');
    if (videoElement.paused) {
      socket.emit('play', {
        currentTime: videoElement.currentTime,
        roomId: roomIdServer,
      });
      return videoElement.play();
    }
    socket.emit('pause', roomIdServer);
    return videoElement.pause();
  });

  // Event listener for the seek bar
  seekBar.addEventListener('change', () => {
    // Calculate the new time
    const time = +videoElement.duration * (seekBar.value / 100).toFixed(2);
    // Update the video time
    socket.emit('seeked', { roomId: roomIdServer, time });
    videoElement.currentTime = time;
  });

  // Update the seek bar as the video plays
  videoElement.addEventListener('timeupdate', () => {
    // Calculate the slider value
    const value = (100 / videoElement.duration) * videoElement.currentTime;
    // Update the slider value
    seekBar.value = value;
    videoTime.innerText = new Date(videoElement.currentTime * 1000)
      .toISOString()
      .substr(11, 8);
  });

  // add movie url
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const url = event.target[0].value;
    socket.emit('movieUrl', { url, roomId: roomIdServer });
    videoElement.src = url;
  });

  // listeners :)

  socket.on('seeked', ({ time }) => {
    videoElement.currentTime = time;
  });

  socket.on('roomId', (data) => {
    roomIdServer = data.roomId;
    roomFeedback.innerText = `connected : ${data.roomId} Room`;
    connectedPeople.innerText = `Connected People ${data.connectedUsers}`;
    joinRoomButton.disabled = true;
  });

  socket.on('pause', () => {
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    return videoElement.pause();
  });

  socket.on('play', async (time) => {
    videoElement.currentTime = time;
    pauseIcon.classList.remove('hidden');
    playIcon.classList.add('hidden');

    await videoElement.play();
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

const messageInput = document.getElementById('message');
const emojiButton = document.getElementById('emoji-button');

const picker = new EmojiButton({
  position: 'right',
});

picker.on('emoji', (emoji) => {
  console.log(emoji);
  messageInput.value += emoji;
});

emojiButton.addEventListener('click', () =>
  picker.pickerVisible ? picker.hidePicker() : picker.showPicker(messageInput),
);
