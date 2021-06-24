// 2. This code loads the IFrame Player API code asynchronously.
const tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'AspEaxovpWA',
    playerVars: {
      playsinline: 1,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
const done = false;
function onPlayerStateChange(event) {}

// function onPlayerStateChange(event) {
//   // console.log(event.data,event.target.getCurrentTime(),"YT.PlayerState",YT.PlayerState)
//   console.log({ player });
//   // if (event.data == YT.PlayerState.PLAYING && !done) {
//   //   setTimeout(stopVideo, 6000);
//   //   done = true;
//   // }

//   switch (event.data) {
//     case 1:
//       socket.emit('play', {
//         currentTime: player.target.getCurrentTime(),
//         roomId: roomIdServer,
//       });
//       break;

//     default:
//       break;
//   }
// }
function stopVideo() {
  player.stopVideo();
}

function playVideo() {
  player.playVideo();
}

function loadvideo() {
  player.loadVideoById('bHQqvYy5KYo', 5, 'large');
}

const youtubeLinkForm = document.getElementById('youtube-link-form');
youtubeLinkForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = getYoutubeId(e.target[0].value);
  player.loadVideoById(id, 0, 'large');
});

function getYoutubeId(url) {
  // url= https://www.youtube.com/watch?v=AspEaxovpWA
  return url.split('=')[1];
}
