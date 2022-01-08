const socket = io('http://localhost:8000')

const form = document.getElementById('send-container')
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector('.container')
const music = new Audio('src/notification.mp3')
// add the message in the message container
const append = (message, position) => {
  const messageElemnt = document.createElement('div')
  messageElemnt.innerText = message
  messageElemnt.classList.add('message')
  messageElemnt.classList.add(position)
  messageContainer.append(messageElemnt)
  if (position == 'left') {
    music.play()
  }
}
// append the client message to the container and also emit the message using 'send' event to the server so that server will broadcast it to the other sockets.
form.addEventListener('submit', (e) => {
  e.preventDefault()
  const message = messageInput.value
  append(`You:${message}`, 'right')
  socket.emit('send', message) // sending to the server
  messageInput.value = ''
})

const name = prompt('Enter your name')
socket.emit('new-user-joined', name)
// whenever this client join then let the server know and then it broadcast to all socket using user-joined event.
socket.on('new-user-joined', (name) => {
  append(`${name} joined`, 'left')
})
// whenever user joined then the message is received from the server and then append to the container
socket.on('user-joined', (name) => {
  append(`${name} joined`, 'left')
})
// client recieving the message from the server
socket.on('receive', (data) => {
  append(`${data.name}:${data.message}`, 'left')
})
// whenever a user left the chat then server will give the  'left' event and then client will append it to the container towards the left side.
socket.on('left', (name) => {
  append(`${name} left`, 'left')
})
