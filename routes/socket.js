var getUserName = (function () {
    // get username from database using api_key
})();

var getFriendName = (function () {
  // get friend username from database when available
  // if not there, set return "Waiting for friend..." and set up a listener
  var promise = new Promise(function(resolve, reject) {
    
})();

module.exports = function (socket) {
  socket.emit('init', {
    user:   getUserName(),
    friend: getFriendName()
