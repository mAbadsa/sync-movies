/* eslint-disable no-alert */
/* eslint-disable no-empty */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable no-undef */
function connectPeerToPeer({ socket, data }) {
  if (peerObject) return;
  // Peer Constructor
  // const myPeer = new Peer(undefined, {
  //   host: '/',
  //   port: '9000',
  // });

  const myPeer = new Peer(undefined, {
    host: 'peerjs-server.herokuapp.com',
    secure: true,
    port: 443,
  });

  peerObject = myPeer;

  // Peer Open Event
  myPeer.on('open', (id) => {
    thisPeerId = id;
    socket.emit('peer-connected', { peerId: id, roomId: data.roomId });
  });

  // Peer Call Event
  myPeer.on('call', async (call) => {
    const answerCall = confirm('Do you want to answer?');

    if (answerCall) {
      peers[call.peer] = call;
      const stream = await getMedia();

      if (!callersMediaElement[thisPeerId]) {
        callersMediaElement[thisPeerId] = addMediaStream({
          stream,
          parent: audioSection,
          streamId: stream.id,
        }); // show my voice
      }

      call.answer(stream);
      call.on('stream', (userStream) => {
        if (!callersMediaElement[call.peer]) {
          callersMediaElement[call.peer] = addMediaStream({
            stream: userStream,
            parent: audioSection1,
            streamId: userStream.id,
          });
          callersMediaElement[call.peer].muted = false;
        }
      });
      call.on('close', () => callersMediaElement[call.peer].remove());
    } else {
      console.log('call denied');
    }
  });

  socket.on('peer-disconnect', ({ peerId }) => {
    peers[peerId].close();
  });

  callBtn.addEventListener('click', () =>
    handleCallButtonClick({ socket, thisPeerId, myPeer }),
  );
}

// handle Call Button Click cb function
async function handleCallButtonClick({ socket, thisPeerId, myPeer }) {
  const stream = await getMedia();
  // To prevent the caller to duplicate his stream and element
  if (!callersMediaElement[thisPeerId]) {
    callersMediaElement[thisPeerId] = addMediaStream({
      stream,
      parent: audioSection,

      streamId: stream.id,
    }); // self
  }

  // getRoomPeers
  socket.emit('call-peers', { roomId: roomIdServer }, (req) => {
    // req have all the peerId;
    req[roomIdServer].forEach(
      (peerId) =>
        peerId !== thisPeerId && connectToPeerId(myPeer, peerId, stream),
    );
  });
}
