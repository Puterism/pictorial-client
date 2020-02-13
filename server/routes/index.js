const express = require('express');
const router = express.Router();
const nanoid = require('nanoid');
const db = require('../lib/db');

router.post('/create', (req, res) => {
    const name = req.body.name;
    if(!name) {
        res.status(400).json({ message: 'name is undefined!' });
        return;
    }
    
    let roomCode;
    while(1) {
        roomCode = nanoid(10);
        const exist = db.findRoom(roomCode);
        if(!exist) break;
    }

    db.addRoom(code);
    db.addUser(name, code);

    res.status(201).json({ roomCode: roomCode });
});

module.exports = router;