const express = require('express');
const router = express.Router();
const nanoid = require('nanoid');
const db = require('../lib/db');

router.get('/', (req, res) => {
    res.send('Welcome!');
});

router.post('/create', async (req, res) => {
    try {
        const name = req.body.name;
        console.log("create Room! username: ", name);

        if(!name) { // name = undefined
            res.status(400).json({ message: 'name is undefined!' });
            return;
        }
        
        let roomCode;
        while(1) { // roomCode create
            roomCode = nanoid(10);
            const exist = await db.findRoom(roomCode);
            if(!exist) break;
        }

        // DB
        await db.addRoom(roomCode);
        await db.addUser(name, roomCode);

        console.log("create Room! Room has created!");
        res.status(201).json({ roomCode: roomCode });
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: error });
    }
    
});

router.post('/invite', async (req, res) => {
    try {
        const roomCode = req.body.roomCode;
        console.log("invite Room! roomCode: ", roomCode);

        // roomCode exist?
        const exist = await db.findRoom(roomCode);
        if(!exist) {
            console.log("invite Room! roomCode don't exist!");
            res.status(400).json({ message: `roomCode don't exist!` });
            return;
        }
        // game start?
        const start = await db.isGameStart(roomCode);
        if(start) {
            console.log("invite Room! Game already started!");
            res.status(400).json({ message: 'Game already started!' });
            return;
        }
        // user full?
        const userList = await db.getUsersInRoom(roomCode);
        if(userList.length >= 7) {
            console.log("invite Room! The room is Full!");
            res.status(400).json({ message: 'The room is Full!' });
            return;
        }
        console.log("invite Room! Right Link!");
        res.status(200).json({ status: 'OK' });
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: error });
    }
});

router.post('/joinRoom', async (req, res) => {
    try {
        const name = req.body.name;
        const roomCode = req.body.roomCode;
        console.log("joinRoom! username: ", name, ", roomCode: ", roomCode);

        // user exist?
        const exist = await db.findUser(name, roomCode);
        if(exist) {
            console.log("joinRoom! 이미 존재하는 이름입니다.");
            res.status(400).json({ message: '이미 존재하는 이름입니다.' });
            return;
        }

        // DB
        const result = await db.addUser(name, roomCode);

        // socket join
        const io = req.app.get('io');
        console.log("joinRoom! socket.io emit join!");
        io.of('/room').emit('join', name, roomCode);
        console.log("joinRoom! successfully join!");
        res.status(200).json({ message: 'successfully join!' });
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: error });
    }

});

module.exports = router;