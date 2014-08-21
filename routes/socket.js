// export function for listening to the socket
module.exports = function (socket, chatrooms) {
  var userId;
  var room = "chatroom_" + socket.handshake.query.chatroomId;
  chatrooms[room] = chatrooms[room] || {};

  socket.join(room);
  // send the new user their name and a list of users
  socket.emit('init', {
    messages : [],
    users : chatrooms[room]
  });

  // notify other clients that a new user has joined
  socket.on('user:join', function(data) {
    chatrooms[room][data.userId] = {
      userName : data.userName
    }
    userId = data.userId;
    socket.broadcast.to(room).emit('user:join', data);
  });

  // broadcast a user's message to other users
  socket.on('send:message', function (data) {
    socket.broadcast.to(room).emit('send:message', data);
  });

  // clean up when a user leaves, and broadcast it to other users
  socket.on('disconnect', function () {
    socket.broadcast.to(room).emit('user:left', {
      userId: userId
    });
    socket.leave(room);
  });
};
