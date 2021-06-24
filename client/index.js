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
const toggleVideoSection = document.getElementById('toggle-video-section');

const mp4VideoSection = document.getElementById('mp4-video-section');

const youtubeSection = document.getElementById('youtube-section');

const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById('pause-button');

//
// window.addEventListener('message', (e) => console.log('message', e));

//
const tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
const firstScriptTag = document.getElementsByTagName('script')[1];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    videoId: 'o6V1by_972w',
    playerVars: {
      controls: 0,
      playsinline: 1,
      enablejsapi: 1,
      autoplay: 0,
    },
    events: {
      onReady: onReadyPlayer,
    },
  });
}

function onReadyPlayer(e) {
  console.log('ready');
  console.log(player);
  console.log(e);

  window.frames.window.postMessage('message hassan', '*');
  player.addEventListener('onStateChange', (event) => {
    console.log(event);
  });
}

function loadvideo(id) {
  player.loadVideoById(id);
}

const youtubeLinkForm = document.getElementById('youtube-link-form');

function getYoutubeId(url) {
  // url= https://www.youtube.com/watch?v=AspEaxovpWA
  return url.split('=')[1];
}

//

let roomIdServer;
let started;

const connectFunction = (e) => {
  e.preventDefault();
  const socket = io.connect('/');

  youtubeLinkForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = getYoutubeId(e.target[0].value);
    console.log(id);
    player.loadVideoById(id);
    socket.emit('movieUrl', { url: id, roomId: roomIdServer });
  });
  const roomId = e.target[0].value;
  socket.emit('roomId', roomId);

  videoElement.addEventListener('play', () => {
    socket.emit('play', {
      currentTime: videoElement.currentTime,
      roomId: roomIdServer,
    });
  });

  socket.on('pause', () => player.pauseVideo());

  socket.on('play', (time) => {
    player.seekTo(time).playVideo();
  });

  playButton.addEventListener('click', () => {
    playButton.style.visibility = 'hidden';
    pauseButton.style.visibility = 'visible';
    socket.emit('play', {
      currentTime: player.getCurrentTime(),
      roomId: roomIdServer,
    });
  });
  // www.youtube.com/watch?v=Pz59wizOqLw
  pauseButton.addEventListener('click', () => {
    playButton.style.visibility = 'visible';
    pauseButton.style.visibility = 'hidden';
    socket.emit('pause', roomIdServer);
  });

  videoElement.addEventListener('pause', () =>
    socket.emit('pause', roomIdServer),
  );

  socket.on('roomId', (data) => {
    roomIdServer = data.roomId;
    roomFeedback.innerText = `You are connected to ${data.roomId} Room`;
    connectedPeople.innerText = `Connected People ${data.connectedUsers}`;
    joinRoomButton.disabled = true;
  });

  // socket.on('pause', () => videoElement.pause());

  // socket.on('play', async (time) => {
  //   videoElement.currentTime = time;
  //   await videoElement.play();
  // });

  socket.on('movieUrl', (url) => {
    console.log(url);
    player.loadVideoById(url).playVideo();
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

toggleVideoSection.addEventListener('click', () => {
  mp4VideoSection.classList.toggle('hidden');
  const isHidden = youtubeSection.classList.toggle('hidden');
  toggleVideoSection.innerText = isHidden
    ? 'Show Youtube Video'
    : 'Show Mp4 Video';
});

// listen play

/// event.data === 1  ===> play event
