var pubsub = require('./pubsub');
var pg = require('pg');

var pgConnection = "postgres://paul:paul@localhost/online_immersion_development";

(function initializeListener (pg, conn) {
  // Set up a single permanent client for chatroom_users listener
  var client = new pg.Client(conn);

  client.connect();
  client.query({name: 'find_user', text: 'SELECT * FROM users WHERE users.id=$1 LIMIT 1'});
  client.query('LISTEN "new_chatroomUser"');
  client.on('notification', function(data) {
    var user = JSON.parse(data.payload);
    console.log('Data returned from DB (json):',user);

    var query = client.query({ name: 'find_user', values: [user.user_id] });
    query.on('row', function(row) {
      console.log('Chatroom user returned from DB:',row);
      console.log('Emitting event:','newUserForChatroom_' + user.chatroom_id);
      pubsub.emit('newUserForChatroom_' + user.chatroom_id, row);
    });
  });
})(pg, pgConnection);

function PG_Constructor(pg, conn) {

  this.Query = function (preparedStatement) {
    var queryResult;
    pg.connect(conn, function(err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err);
        done();
      }

      var query = client.query( preparedStatement );

      query.on('row', function(row, result) {
        console.log("Returned from DB on 'row' event:",row);
        result.addRow(row);
      });

      query.on('end', function(result) {
        console.log("Returned from DB on 'end' event:",result);
        queryResult = result
        done();
      });
    });
    return user;
  };
};

PG = module.exports = new PG(pg, pgConnection);
