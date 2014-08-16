var express = require('express');
var cookieParser = require('cookie-parser');
var IO = require('socket.io');

var app = module.exports = express.createServer();
var io = IO.listen(app);

var routes = require('./routes/index');
var socket = require('./routes/socket.js');

app.use(cookieParser());

app.use('/', routes);
io.sockets.on('connection', socket);

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
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
