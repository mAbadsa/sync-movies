/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable no-undef */
let peerObject;
function connectPeerToPeer({ socket, data }) {
  if (peerObject) return;
  // Peer Constructor
  const myPeer = new Peer(undefined, {
    host: '/',
    port: '9000',
  });

  // Peer Open Event
  myPeer.on('open', (id) => {
    thisPeerId = id;
    socket.emit('peer-connected', { peerId: id, roomId: data.roomId });
  });

  // Peer Call Event
  myPeer.on('call', async (call) => {
    let mediaElement;
    const stream = await getMedia();
    call.answer(stream);
    call.on('stream', (userStream) => {
      mediaElement = addMediaStream(userStream, audioSection);
    });
    call.on('close', () => mediaElement.remove());
  });

  callBtn.addEventListener('click', () =>
    handleCallButtonClick({ socket, thisPeerId, myPeer }),
  );
}

// handle Call Button Click cb function
async function handleCallButtonClick({ socket, thisPeerId, myPeer }) {
  let peers;
  const stream = await getMedia();
  addMediaStream(stream, audioSection); // self

  // getRoomPeers
  socket.emit('call-peers', { roomId: roomIdServer }, (req) => {
    // req have all the peerId;
    peers = req[roomIdServer].reduce((total, peerId) => {
      if (peerId !== thisPeerId) {
        total[peerId] = connectToPeerId(myPeer, peerId, stream);
      }
      return total;
    }, {});
  });

  socket.on('peer-disconnect', ({ peerId }) => {
    peers[peerId].close();
  });
}
