var express = require('express');
var http = require('http');
// var cookieParser = require('cookie-parser');
var io = require('socket.io')({
  // socket.io options
});

var app = module.exports = express();
var server = http.createServer(app);

var socket = require('./routes/socket.js');

io.of('/chatrooms/:chatroomId/').use(function(socket, next) {
  var handshakeData = socket.request;
  console.log(handshakeData);
  // authenticate against apiKey
  // if (error) stop and stuff;
  next();
});

io.sockets.on('connection', socket);

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

server.listen(process.env.PORT, '11.11.11.12', function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
