const socketio = require('socket.io');
const db = require('./db');

module.exports = (server, app) => {
    const io = socketio(server);

    app.set('io', io);
    const room = io.of('/room');

    room.on('connect', (socket) => {
        console.log('socket.io room connected!');

        let roomCode, userName;

        socket.on('join', (name, code) => {
            console.log('room join!');
            
            socket.emit('message', { text: `Welcome to the room ${code}!`});
            socket.broadcast.to(code).emit('message', { text: `${name}, has joined!`});

            socket.join(code);
            roomCode = code;
            userName = name;
        });

        socket.on('disconnect', () => {
            console.log('room disconnected!');
            if(roomCode) {
                // DB 처리
                db.deleteUser(userName, roomCode);
                const result = db.getUsersInRoom(roomCode);
            }
        }); 
    });
}