const socket = window.io();

// user connects
const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const charList = chars.split('');
const charListLength = charList.length;

function sortCharIndex() {
  return Math.round(Math.random() * (charListLength - 1));
}

function generateNickname(nicknameSize) {
  const nicknameAggregator = [];
  for (let i = 1; i <= nicknameSize; i += 1) {
    const index = sortCharIndex();
    const char = charList[index];
    nicknameAggregator.push(char);
  }
  const nickname = nicknameAggregator.join('');
  return nickname;
}

const randomNickname = `User #${generateNickname(6)}`;
console.log('Random nickname', randomNickname);
sessionStorage.setItem('sessionUserNickname', randomNickname)
socket.emit('newConnection', randomNickname);

// Send message
const sendMessageForm = document.querySelector('.send-message');
sendMessageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const userNickname = sessionStorage.getItem('sessionUserNickname');
  const messageInput = document.querySelector('.send-message-input');
  const message = messageInput.value;
  console.log('Nickname que mandou mensagem: ', userNickname);
  console.log('Mensagem', message);
  socket.emit('message', { chatMessage: message, nickname: userNickname });
  messageInput.value = '';
  return false;
});

// Change nickname
const nicknameForm = document.querySelector('.change-nickname');
nicknameForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const userNickname = sessionStorage.getItem('sessionUserNickname');
  const nicknameInput = document.querySelector('.nickname-input');
  const newNickname = nicknameInput.value;
  console.log(`${userNickname} mudou seu nickname para: ${newNickname}`);
  sessionStorage.setItem('sessionUserNickname', newNickname);
  const socketId = socket.id;
  socket.emit('nickname.change', { socketId, newNickname });
  nicknameInput.value = '';
  return false;
});

function showChatMessage({timestamp, nickname, chatMessage}) {
  sessionUserNickname = sessionStorage.getItem('sessionUserNickname');
  console.log(timestamp, nickname, chatMessage);
  const messagesUl = document.querySelector('.messages');
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  const messageCard = document.createElement('div')
  messageCard.classList.add("message-card");
  const nicknameLabel = document.createElement('p');
  nicknameLabel.classList.add("message-card-nickname");
  const messageLabel = document.createElement('p')
  messageLabel.classList.add("message-card-message");
  const timestampLabel = document.createElement('p')
  timestampLabel.classList.add("message-card-timestamp");
  nicknameLabel.textContent = nickname;
  messageLabel.textContent = chatMessage;
  timestampLabel.textContent = timestamp;
  messageCard.innerHTML = (
    nicknameLabel.outerHTML + messageLabel.outerHTML + timestampLabel.outerHTML
  );
  if (sessionUserNickname === nickname) {
    messageCard.classList.add('session-user-message-card');
    li.classList.add('session-user-line');
  } else {
    messageCard.classList.add('other-user-message-card');
  }
  li.appendChild(messageCard);
  messagesUl.appendChild(li);
}

// Hello - checks connection
socket.on('hello', (nickname) => {
  console.log('Hello!!!');
  console.log(`Your id is ${socket.id}.`);
  console.log(`Your nickname is ${nickname}.`);
});

// Get messages from other users
socket.on('message', (message) => {
  showChatMessage(message);
});

// A client joins the chat or changes the nickname
socket.on('usersUpdate', (users) => {
  sessionUserNickname = sessionStorage.getItem('sessionUserNickname');
  const sessionUser = users.find((user) => user.socketId === socket.id);
  const filteredUsers = users.filter((user) => user.socketId !== socket.id);
  const usersToDisplay = [sessionUser, ...filteredUsers];

  const usersLi = document.querySelector('.users');
  usersLi.innerHTML = '';
  usersToDisplay.forEach((user) => {
    const li = document.createElement('li');
    li.innerHTML = user.nickname;
    li.setAttribute('data-testid', 'online-user');
    if (user.nickname === sessionUserNickname) {
      li.classList.add('session-user');
    } else {
      li.classList.add('other-user');
    }
    usersLi.appendChild(li);
  });
});
