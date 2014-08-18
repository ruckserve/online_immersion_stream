var pubsub = require('../lib/pubsub')
var pg = require('../lib/pg')

var validateUserName = (function (apiKey) {
  // pg.getUserByKey(apiKey)
  // get username from database using api_key
})();

var getFriendName = new Promise(resolve, reject) {
  friend = pg.getUser('chatroom_users', {'chatroom_id': chatroom_id});
  if (friend) {
    // get friend username from database when available
    resolve(friend);
  } else {
    pubsub.on('newUserForChatroom_' + chatroom_id, function(friend) {
      resolve(friend);  
    });
  }
};

module.exports = function (socket) {
  // Initiate socket
  var message, messages;

  var friend = getFriendName() 
  // Friend promise
  friend.then(
    function (friendName) {
      socket.emit('friend:join', {
        friend: friendName
      });
    },
    function (err) {
      socket.emit('reset:session', {
        // handle an error
        });
    }
  );
      
  messages = pg.getAllMessages(chatroomId);
  messages.then(
    function (messages) {
      socket.emit('init', {
        messages: messages
      });
    },
    function (err) {
      // handle an error
      // probably just an empty return?
      console.error(err);
    }
  );
      
  message = user + ' has joined the chat'; 
  pg.saveMessage(chatroomId, 0, message);

  socket.broadcast.emit('user:join', {
    name: 'chatroom',
    message: message
  });

  // Events

  // broadcast a user's message to other users
  socket.on('send:message', function (data) {
    socket.broadcast.emit('send:message', {
      user: name,
      text: data.message
    });
    pg.saveMessage(chatroomId, userId, message);
  });

  socket.on('disconnect', function() {
    socket.broadcast.emit('user:left', {
      name: name
    });
    pg.killChatroom();
  });
};
