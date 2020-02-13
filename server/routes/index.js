const express = require('express');
const router = express.Router();
const nanoid = require('nanoid');
const db = require('../lib/db');

router.get('/', async (req, res) => {
    try {
        const result = await db.getUsersInRoom("b38sdbk");
        console.log('result: ', result);
        if(result >= 7) {
            console.log(`You can't enter the room!`);
        }
    } catch (error) {
        console.error(error);
    }
});

router.post('/create', async (req, res) => {
    try {
        const name = req.body.name;
        console.log(name);

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

        res.status(201).json({ roomCode: roomCode });
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: error });
    }
    
});

router.post('/invite', async (req, res) => {
    try {
        const roomCode = req.body.roomCode;
        const name = req.body.name;
        console.log(roomCode, name);

        // roomCode exist?
        const exist = await db.findRoom(roomCode);
        if(!exist) {
            res.status(400).json({ message: `roomCode don't exist!` });
            return;
        }
        // game start?
        const start = await db.isGameStart("b38sdbk");
        if(start) {
            res.status(400).json({ message: 'Game already started!' });
            return;
        }
        // user full?
        const userNum = await db.getUsersInRoom("b38sdbk");
        if(userNum >= 7) {
            res.status(400).json({ message: 'The room is Full!' });
            return;
        }
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: error });
    }
});

module.exports = router;