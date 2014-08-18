var pg = require('pg');
require('polyfill-promise');

module.exports = function (pubsub) {

  var pgConnection = "postgres://paul:paul@localhost/online_immersion_development";

  (function initializeListener () {
    // Set up a single permanent client for chatroom_users listener
    var client = new pg.Client(pgConnection);

    client.connect();
    query = client.query('LISTEN "new_chatroomUser"');

    client.on('notification', function(data) {
      var user = JSON.parse(data.payload);
      console.log('pg chatroom write triggered event (json):',user);

      var chatUser = PG.getUser(user.user_id);
      pubsub.emit('newUserForChatroom_' + user.chatroom_id, chatUser);
    });

    query.on('error', function(err) {
      return console.error('pg query error', err);
    });

  })();

  function PreparedStatementGenerator(ps) {
    // Create permanent connection
    var client = new pg.Client(pgConnection);
    client.connect();

    client.query( { 'name': ps.name, 'text': ps.text });

    return function(splat) {
      
      var values = Array.prototype.slice.call(arguments);

      var queryResult = new Promise(function (resolve, reject) {

        client.query( { 'name': ps.name, 'values': values } );

        query.on('row', function(row, result) {
          console.log("pg query generated 'row' event:",row);
          result.addRow(row);
        });

        query.on('end', function(result) {
          console.log("pg query generated 'end' event:",result);
          resolve(result);
          });

        query.on('error', function(err) {
          return console.error('pg query error', err);
          reject(err);
        });
      });
      return queryResult;
    };  // End return function
  };

  PG = {};

  PG.getUser = PreparedStatementGenerator({
    'name': 'find_user',
    'text': 'SELECT * FROM users WHERE id=$1 LIMIT 1;'
  });

  PG.getChatroomUsers = PreparedStatementGenerator({
    'name': 'find_chatroom_users',
    'text': 'SELECT * FROM chatroom_users WHERE chatroom_id=$1;'
  });

  PG.saveMessage = PreparedStatementGenerator({
    'name': 'put_message',
    'text': 'INSERT INTO messages (chatroom_id, user_id, message) VALUES ($1, $2, $3);'
  });

  PG.getAllMessages = PreparedStatementGenerator({
    'name': 'fetch_messages',
    'text': 'SELECT * FROM messages WHERE chatroom_id=$1;'
  });

  PG.getUserByKey = PreparedStatementGenerator({
    'name': 'find_user_by_api_key',
    'text': 'SELECT u.* FROM users AS u INNER JOIN api_keys AS ak ON ak.user_id=u.id WHERE ak.value=$1 LIMIT 1;'
  });

  PG.killChatroom = PreparedStatementGenerator({
    'name': 'kill_chatroom',
    'text': "UPDATE chatrooms WHERE id=$1 AND concluded=f SET concluded=t updated_at=(SELECT NOW() AT TIME ZONE 'utc');"
  });

  return PG;

};

