Error.stackTraceLimit = Infinity;
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  socket = require('./routes/socket.js');

var app = module.exports = express.createServer();

// Hook Socket.io into Express
var io = require('socket.io').listen(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Socket.io Communication
var chatrooms = {};
io.sockets.on('connection', function(io) {
  socket(io, chatrooms);
});

// Start server

// app.listen(process.env.PORT, '11.11.11.12', function(){
app.listen(process.env.PORT, function(){
  console.log("Express server listening on %s:%d in %s mode", app.address().address, app.address().port, app.settings.env);
});
