const socket = io.connect('/');

const form = document.getElementById('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log(e);
  const url = e.target[0].value;
  socket.emit('movieUrl', url);
});
