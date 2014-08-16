var pubsub = require('../lib/pubsub')
var 

var validateUserName = (function () {
    // get username from database using api_key
})();

var getFriendName = new Promise(resolve, reject) {
  pg = app.pg
  friend = pg.find_by('chatroom_users', {'chatroom_id': chatroom_id});
  if (friend) {
    // get friend username from database when available
    resolve(friend);
  } else {
    pubsub.on('newUserForChatroom_' + chatroom_id, function(userId) {
      friend = pg.find('users', userId);
      resolve(friend);  
    });
  }
})();

module.exports = function (socket) {
  socket.emit('init', {
    user:   getUserName(),
    friend: getFriendName()
