const socketio = require('socket.io');
const db = require('./db');

module.exports = (server, app, sessionMiddleware) => {
    const io = socketio(server);

    app.set('io', io);
    const room = io.of('/room');
    io.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res, next);
    });

    room.on('connect', (socket) => {
        console.log('socket.io room connected!');
        const req = socket.request;

        socket.on('join', (name, code) => {
            console.log('room join!');
            
            socket.emit('message', { text: `Welcome to the room ${code}!`});
            socket.broadcast.to(code).emit('message', { text: `${name}, has joined!`});

            socket.join(code);

            req.session.userName = name;
            req.session.roomCode = code;
            console.log(req.session.userName, req.session.roomCode);
        });

        socket.on('disconnect', () => {
            console.log('room disconnected!');
            // DB 처리
        }); 
    });
}