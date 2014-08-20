var express = require('express');
var http = require('http');
var events = require('events');
var pubSub = new events.EventEmitter();
var db = require('./lib/db')(pubSub);
// var cookieParser = require('cookie-parser');

var io = require('socket.io')({
  // socket.io options
});

var app = module.exports = express();
var server = http.createServer(app);
var socket = require('./routes/socket.js')(db, pubSub);

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
  console.log("Express server listening on %s:%d in %s mode", server.address().address, server.address().port, app.settings.env);
});
