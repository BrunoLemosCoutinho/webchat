const moment = require('moment');
const formatChatMessage = require('./formatChatMessage');

function handleMessageSent({ io, chatMessage, nickname }) {
  const timestamp = moment().format('DD-MM-YYYY HH:mm:ss');
  /* const formattedMessage = formatChatMessage({ chatMessage, nickname, timestamp });
  io.emit('message', formattedMessage); */
  const message = {
    timestamp,
    nickname,
    chatMessage,
  };
  io.emit('message', message);
}

module.exports = handleMessageSent;
