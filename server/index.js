const express = require('express');
const http = require('http');
const session = require('express-session');
const WebSocket = require('./lib/socket');
const sequelize = require('./models').sequelize;

const port = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);
sequelize.sync();

const sessionMiddleware = session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
});

const router = require('./routes/index');
app.use(router);

server.listen(port, () => console.log(`Server has started on port ${port}`));

WebSocket(server, app, sessionMiddleware);