/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
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
const joinRoomDiv = document.getElementById('join-room-div');
const roomManagementDiv = document.getElementById('room-management-div');
const signal = document.getElementById('signal');
const createRoom = document.getElementById('create-room');
const joinRoom = document.getElementById('join-room');

createRoom.addEventListener('click', () => {
  roomManagementDiv.classList.add('hidden');
});

joinRoom.addEventListener('click', () => {
  roomManagementDiv.classList.add('hidden');
});

// videoElement.removeAttribute('controls');
//

const notificationSound = new Audio('./pristine-609.mp3');
const playSound = new Audio('./play.wav');
const pauseSound = new Audio('./pause.wav');
const joinedSound = new Audio('./joined.mp3');

notificationSound.volume = 0.1;
playSound.volume = 0.1;
pauseSound.volume = 0.1;
joinedSound.volume = 0.3;

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

videoElement.addEventListener('waiting', () => console.log('waiting'));
videoElement.addEventListener('suspend', () => console.log('suspend'));
videoElement.addEventListener('load', () => console.log('load event'));
videoElement.addEventListener('loadeddata', () => console.log('loadeddata'));
videoElement.addEventListener('playing', () => console.log('playing'));

//
let roomIdServer;
const loadedDataUsers = {};
let connectedUserCount = 0;

const connectFunction = (e, { status }) => {
  const socket = io.connect('/');

  if (status === 'create-room') {
    socket.emit('create-room', { loadedData: videoElement.readyState >= 2 });
  } else if (status === 'join-room') {
    e.preventDefault();
    socket.emit('join-room', {
      roomId: e.target[0].value,
      loadedData: videoElement.readyState >= 2,
    });
  }

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

  videoElement.addEventListener('loadeddata', () => {
    socket.emit('loadeddata', {
      roomId: roomIdServer,
      loadedData: videoElement.readyState >= 2,
    });
  });

  socket.on('loadeddata', ({ loadDataUsers }) => {
    colorizeSignal(loadDataUsers);
  });

  videoElement.addEventListener('waiting', () => {
    videoElement.addEventListener(
      'playing',
      () => console.log('playing once'),
      {
        once: true,
      },
    );
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
    notifyMe(
      `Joined Room : ${data.roomId} - Connected People ${data.connectedUsers} `,
      joinedSound,
    );
    roomFeedback.value = `${data.roomId}`;
    roomFeedback.select();
    connectedUserCount = data.connectedUsers;
    document.execCommand('copy');
    connectedPeople.innerText = `Connected People ${data.connectedUsers}`;
    joinRoomButton.disabled = true;
    loadedDataUsers[data.id] = data.loadedData;
    colorizeSignal(data.loadDataUsers);
  });

  socket.on('pause', () => {
    notifyMe('Some one Paused', pauseSound);
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    return videoElement.pause();
  });

  socket.on('play', async (time) => {
    notifyMe('Some one start playing', playSound);
    await videoElement.play();
    videoElement.currentTime = time;
    pauseIcon.classList.remove('hidden');
    playIcon.classList.add('hidden');
  });

  socket.on('movieUrl', (url) => {
    videoElement.src = url;
  });

  // Emit events
  chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    output.innerHTML += `<p><strong>${handle.value}: </strong>${message.value}</p>`;

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
    hideNotification(`${data.handle}:${data.message}`, notificationSound);
  });

  socket.on('typing', (data) => {
    feedback.innerHTML = `<p><em>${data} is typing a message...</em></p>`;
  });
};

roomForm.addEventListener('submit', (e) => {
  joinRoomDiv.classList.add('hidden');
  connectFunction(e, { status: 'join-room' });
});

createRoom.addEventListener('click', () => {
  roomManagementDiv.classList.add('hidden');
  connectFunction(null, { status: 'create-room' });
});

joinRoom.addEventListener('click', () => {
  roomManagementDiv.classList.add('hidden');
  joinRoomDiv.classList.remove('hidden');
});

const messageInput = document.getElementById('message');
const emojiButton = document.getElementById('emoji-button');

const picker = new EmojiButton({
  position: 'left-end',
});

picker.on('emoji', (emoji) => {
  messageInput.value += emoji;
});

emojiButton.addEventListener('click', () =>
  picker.pickerVisible ? picker.hidePicker() : picker.showPicker(messageInput),
);

function notifyMe(message, notificationSoundRef) {
  // Let's check if the browser supports notifications
  notificationSoundRef.play();
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification');
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === 'granted') {
    // If it's okay let's create a notification
    const notification = new Notification(message);
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === 'granted') {
        const notification = new Notification(message);
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them any more.
}

function hideNotification(message, notificationSoundRef) {
  return document.hasFocus() || notifyMe(message, notificationSoundRef);
}

function colorizeSignal(loadedDataUsers) {
  if (loadedDataUsers === connectedUserCount) {
    signal.classList.add('green');
  } else {
    signal.classList.remove('green');
  }
}
