const socketio = require('socket.io');

module.exports = (server, app) => {
    const io = socketio(server);
}