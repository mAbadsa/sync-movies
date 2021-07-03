/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */

// //
//
const videoElement = document.getElementById('video-element');
const message = document.getElementById('message');
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
const globalNickname = { nickname: 'random user' };
const nicknameForm = document.getElementById('nickname-form');
const audioSection = document.getElementById('audio-section');
const callBtn = document.getElementById('call-btn');
const audioSection1 = document.getElementById('audio-section-1');
const inputRoomId = document.getElementById('input-room-id');
const connectedPeopleList = document.getElementById('connected-people-list');

if (localStorage.getItem('nickname')) {
  globalNickname.nickname = localStorage.getItem('nickname');
  document.title += ` - ${globalNickname.nickname}`;
  nicknameForm.classList.add('hidden');
} else {
  nicknameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nickname = e.target[0].value;
    globalNickname.nickname = nickname;
    localStorage.setItem('nickname', nickname);
    document.title += ` - ${nickname}`;
    nicknameForm.classList.add('hidden');
  });
}

window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get('roomId');
  if (roomId) {
    return connectFunction(roomId, { status: 'join-room' });
  }
  return null;
});

createRoom.addEventListener('click', () => {
  if (globalNickname.nickname === 'random user') {
    return alert('please add a nickname :)');
  }
  roomManagementDiv.classList.add('hidden');
});

joinRoom.addEventListener('click', () => {
  if (globalNickname.nickname === 'random user') {
    return alert('please add a nickname :)');
  }
  return roomManagementDiv.classList.add('hidden');
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

//
let roomIdServer;
const loadedDataUsers = {};
let connectedUserCount = 0;
let peerObject;
let callerMediaElement;
const callersMediaElement = {};

const peers = {};
const connectFunction = (roomId, { status }) => {
  const socket = io.connect('/');
  // const myPeer = new Peer(undefined, {
  //   host: 'peerjs-server.herokuapp.com',
  //   secure: true,
  //   port: 443,
  // });

  if (status === 'create-room') {
    socket.emit('create-room', {
      loadedData: videoElement.readyState >= 2,
      nickname: globalNickname.nickname,
    });
  } else if (status === 'join-room') {
    socket.emit('join-room', {
      roomId,
      loadedData: videoElement.readyState >= 2,
      nickname: globalNickname.nickname,
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
    // send the current Time to every user at each minute.
    if (+videoElement.currentTime.toFixed(0) % 5 === 0) {
      socket.emit('timeUpdated', {
        roomId: roomIdServer,
        currentTime: videoElement.currentTime,
      });
    }

    // Update the slider value
    seekBar.value = value;
    videoTime.innerText = new Date(videoElement.currentTime * 1000)
      .toISOString()
      .substr(11, 8);
  });

  socket.on('timeUpdated', ({ usersNickNames }) => {
    createConnectedPeopleList(usersNickNames, connectedPeopleList);
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

  // add movie url
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const url = event.target[0].value;
    socket.emit('movieUrl', { url, roomId: roomIdServer });
    videoElement.src = url;
  });

  // listeners :)

  // need fix for chrome
  socket.on('seeked', async ({ time }) => {
    videoElement.currentTime = time;
  });

  socket.on('roomId', (data) => {
    roomIdServer = data.roomId;
    notifyMe(
      `Joined Room : ${data.roomId} - Connected People ${data.connectedUsers} `,
      joinedSound,
    );

    if (status === 'create-room') {
      const value = `${window.location.href}?roomId=${data.roomId}`;
      copyToClipboard(value);
    }
    connectedUserCount = data.connectedUsers;
    connectedPeople.innerText = `Connected People ${data.connectedUsers}`;
    joinRoomButton.disabled = true;
    loadedDataUsers[data.id] = data.loadedData;
    colorizeSignal(data.loadDataUsers);
    connectPeerToPeer({ socket, data });
  });

  socket.on('pause', ({ nickname }) => {
    notifyMe(`${nickname} Paused`, pauseSound);
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    return videoElement.pause();
  });

  socket.on('play', async ({ time, nickname }) => {
    notifyMe(`${nickname} start playing`, playSound);
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
    output.innerHTML += `<p><strong>${globalNickname.nickname}: </strong>${message.value}</p>`;

    socket.emit('chat', {
      roomId: roomIdServer,
      message: {
        message: message.value,
        handle: globalNickname.nickname,
      },
    });
    message.value = '';
  });

  message.addEventListener('keypress', () => {
    socket.emit('typing', {
      message: globalNickname.nickname,
      roomId: roomIdServer,
    });
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
  e.preventDefault();
  connectFunction(e.target[0].value, { status: 'join-room' });
});

createRoom.addEventListener('click', () => {
  if (globalNickname.nickname === 'random user') {
    return alert('please add a nickname :)');
  }
  roomManagementDiv.classList.add('hidden');

  return connectFunction(null, { status: 'create-room' });
});

joinRoom.addEventListener('click', () => {
  if (globalNickname.nickname === 'random user') {
    return alert('please add a nickname :)');
  }
  roomManagementDiv.classList.add('hidden');
  return joinRoomDiv.classList.remove('hidden');
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

function createConnectedPeopleList(peopleData, parent) {
  [...parent.children].forEach((item) => item.remove());
  const ul = document.createElement('ul');
  const list = peopleData.map((user) => {
    const li = document.createElement('li');
    const nameSpan = document.createElement('span');
    nameSpan.innerText = user.nickname;
    const timeSpan = document.createElement('span');
    const time = user.currentTime || 0;
    timeSpan.innerText = new Date(time * 1000).toISOString().substr(11, 8);
    li.append(nameSpan, timeSpan);
    return li;
  });
  ul.append(...list);
  parent.append(ul);
}

// web RTC function
async function getMedia() {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  return stream;
}

function addMediaStream({ stream, parent, MediaType = 'video', streamId }) {
  const mediaElement = document.createElement(MediaType);
  mediaElement.controls = false;
  mediaElement.id = streamId.slice(1, streamId.length - 1);
  mediaElement.muted = true;
  mediaElement.srcObject = stream;
  mediaElement.addEventListener('loadedmetadata', () => {
    mediaElement.play();
  });
  const controls = document.createElement('div');
  controls.classList.add('controls');
  const muteButton = document.createElement('button');
  const audioIcon = document.createElement('i');

  audioIcon.classList.add(...['fas', 'fa-microphone', 'style']);

  const audioIconDisabled = document.createElement('i');
  audioIconDisabled.classList.add(
    ...['fas', 'fa-microphone-slash', 'hidden', 'style'],
  );

  muteButton.append(audioIcon, audioIconDisabled);
  muteButton.style.zIndex = 1000;
  muteButton.classList.add(['control-button']);

  muteButton.addEventListener('click', () => {
    const audioTrack = stream.getAudioTracks()[0];
    console.log('audioTrack', audioTrack);
    audioTrack.enabled = !audioTrack.enabled;
    if (audioTrack.enabled) {
      audioIcon.classList.remove('hidden');
      audioIconDisabled.classList.add('hidden');
    } else {
      audioIconDisabled.classList.remove('hidden');
      audioIcon.classList.add('hidden');
    }
  });

  const videoButton = document.createElement('button');
  const videoIcon = document.createElement('i');
  videoIcon.classList.add(...['fas', 'fa-video', 'style', 'hidden']);
  videoButton.append(videoIcon);

  const videoIconDisabled = document.createElement('i');
  videoIconDisabled.classList.add(...['fas', 'fa-video-slash', 'style']);
  videoButton.append(videoIconDisabled);

  videoButton.style.zIndex = 1000;
  videoButton.classList.add('control-button');
  videoButton.disabled = true;
  const videoTrack = stream.getVideoTracks()[0];
  if (videoTrack) {
    videoButton.disabled = false;
    videoButton.addEventListener('click', () => {
      videoTrack.enabled = !videoTrack.enabled;
      if (videoTrack.enabled) {
        videoIcon.classList.remove('hidden');
        videoIconDisabled.classList.add('hidden');
      } else {
        videoIconDisabled.classList.remove('hidden');
        videoIcon.classList.add('hidden');
      }
    });
  }

  const containerDiv = document.createElement('div');
  controls.append(muteButton, videoButton);
  containerDiv.append(mediaElement, controls);
  parent.append(containerDiv);
  return containerDiv;
}

function connectToPeerId(peerInstance, peerId, stream) {
  if (!callersMediaElement[peerId]) {
    const call = peerInstance.call(peerId, stream);
    call.on('stream', (userStream) => {
      if (!callersMediaElement[peerId]) {
        callersMediaElement[peerId] = addMediaStream({
          stream: userStream,
          parent: audioSection1,
          streamId: userStream.id,
        });
        callersMediaElement[peerId].muted = false;
      }
    });
    call.on('close', () => callersMediaElement[peerId].remove());
    peers[call.peer] = call;
  }
}

function copyToClipboard(str) {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}
