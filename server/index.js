const express = require('express');
const http = require('http');
const session = require('express-session');
const bodyParser = require('body-parser');
const WebSocket = require('./lib/socket');
const sequelize = require('./models').sequelize;

const port = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
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

const indexRouter = require('./routes/index');
app.use('/', indexRouter);

server.listen(port, () => console.log(`Server has started on port ${port}`));

WebSocket(server, app, sessionMiddleware);