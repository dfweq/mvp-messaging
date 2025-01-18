// public/script.js
const socket = io();

// Grab elements
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');

// On receiving a 'chatMessage' from the server
socket.on('chatMessage', (msg) => {
  displayMessage(msg);
});

// Send message to server when button is clicked
sendBtn.addEventListener('click', () => {
  const msg = messageInput.value.trim();
  if (msg !== '') {
    socket.emit('chatMessage', msg);
    messageInput.value = '';
  }
});

// Send message on 'Enter' keypress
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    sendBtn.click();
  }
});

// Display message in the messages div
function displayMessage(msg) {
  const messageElement = document.createElement('div');
  messageElement.textContent = msg;
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // auto-scroll to bottom
}
