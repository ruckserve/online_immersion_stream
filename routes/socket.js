require('polyfill-promise');

module.exports = function (db, pubsub) {

var validateUserName = (function (apiKey) {
  // db.getUserByKey(apiKey)
  // get username from database using api_key
})();

var getUser = function () {
  var user = db.getUser(global.userId);
  return user.done(function (user) {
    return user.first_name;
  }, function (err) {
    throw err;
  });
};

var getFriendName = new Promise(function (resolve, reject) {
  var users = db.getChatroomUsers(global.chatroomId);
  var friend = users.done(function (usersArray) {
    var index = usersArray.indexOf(global.userId);
    return array.splice(index,1);
  }, function (err) {
    throw err;
  });

  if (friend) {
    // get friend username from database when available
    resolve(friend);
  } else {
    pubsub.on('newUserForChatroom_' + global.chatroomId, function(friend) {
      resolve(friend);  
    });
  }
});

return function (socket) {
  // Initiate socket
  var message, messages;

  var friend = getFriendName() 
  // Friend promise
  friend.done(
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
      
  messages = db.getAllMessages(global.chatroomId);
  messages.done(
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
      
  socket.broadcast.emit('user:join', {
    name: first_name
  });

  // Events

  // broadcast a user's message to other users
  socket.on('send:message', function (data) {
    socket.broadcast.emit('send:message', {
      user: name,
      text: data.message
    });
    db.saveMessage(global.chatroomId, global.userId, message);
  });

  socket.on('disconnect', function() {
    socket.broadcast.emit('user:left', {
      name: name
    });
    db.killChatroom();
  });
};

};
