require('polyfill-promise');

module.exports = function (db, pubsub) {

  function validateUserName (apiKey, error, callback) {
    // db.getUserByKey(apiKey)
    // get username from database using api_key
  };

//    var user = db.getUser(data.userId);
//    user
//    return user.done(function (user) {
//      return user.first_name;
//    }, function (err) {
//      // throw err;
//      console.log(err);
//    });
//  };
//
//  var getFriendName = function (data, error, callback) {
//    return new Promise(function (resolve, reject) {
//      var users = db.getChatroomUsers(global.chatroomId);
//      var friend = users.done(function (usersArray) {
//        var index = usersArray.indexOf(global.userId);
//        return array.splice(index,1);
//      }, function (err) {
//        // throw err;
//        console.log(err);
//      });
//
  function getUser (data, error, callback) {
    var queryPromise = db.getUser(data.userId);
    queryPromise.then(callback(promiseVal), error(promiseVal));
  };

  function getFriendName (data, error, callback) {
    var queryPromise = db.getChatroomUsers(data.chatroomId);
    queryPromise.then(callback(promiseVal), function(data, error, callback) {
      pubsub.on('newUserForChatroom_' + data.chatroomId,
                callback(promiseVal), error(promiseVal))
    });
  };

  return function (socket, sessionData) {
    // Initiate socket
    var message, messages, friend
      , userId = sessionData.userId
      , chatroomId = sessionData.chatroomId;


    getUser(data, rejectUser, function {
    
    db.getUser(data)
    .then(function (user) {
      return validateUser(apiKey, user);
    });
    .catch(rejectUser)
    .then(connectUserToSocket)


    var friend = getFriendName(
    // Friend promise
    ) 
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
      
      db.killChatroom(global.chatroomId);
    });
  };

};
