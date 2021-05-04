const handleNewConnection = require('./handleNewConnection');
const handleMessageSent = require('./handleMessageSent');
const handleClientDisconnection = require('./handleClientDisconnection');
const handleNicknameChange = require('./handleNicknameChange');
const formatChatMessage = require('./formatChatMessage');

module.exports = {
  handleNewConnection,
  handleMessageSent,
  handleClientDisconnection,
  handleNicknameChange,
  formatChatMessage,
};
