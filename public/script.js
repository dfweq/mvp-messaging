// public/script.js
const socket = io();
let passphrase = '';

// Prompt for a passphrase (shared secret)
// In a real-world scenario, you'd use a more secure approach.
window.addEventListener('load', () => {
  passphrase = prompt('Enter your shared passphrase for encryption:') || '';
});

const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');

// Receive messages (ciphertext) from the server
socket.on('chatMessage', (encryptedMsg) => {
  // Decrypt using the passphrase
  let decryptedMsg = '';
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedMsg, passphrase);
    decryptedMsg = bytes.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    decryptedMsg = '(Error decrypting message)';
  }

  // If passphrase is wrong or decryption fails, 
  // the result might be empty or unreadable.
  if (!decryptedMsg) {
    decryptedMsg = '(Could not decrypt message. Check your passphrase.)';
  }

  displayMessage(decryptedMsg);
});

// Send message to server (encrypt first)
sendBtn.addEventListener('click', () => {
  const plaintext = messageInput.value.trim();
  if (plaintext !== '') {
    // Encrypt the message
    const encryptedMsg = CryptoJS.AES.encrypt(plaintext, passphrase).toString();
    // Send encrypted message
    socket.emit('chatMessage', encryptedMsg);
    messageInput.value = '';
  }
});

// Send on Enter
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    sendBtn.click();
  }
});

function displayMessage(msg) {
  const messageElement = document.createElement('div');
  messageElement.textContent = msg;
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
