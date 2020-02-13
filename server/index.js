const express = require('express');
const http = require('http');
const WebSocket = require('./lib/socket');
const sequelize = require('./models').sequelize;
const path = require('path');

const port = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);
// sequelize.sync();

const router = require('./routes/index');
const imageRouter = require('./routes/images');                 // kyw

app.use(express.json());                                        // kyw
app.use(express.urlencoded({ extended: false }));               // kyw
app.use(express.static(path.join(__dirname, 'public')));        // kyw

app.use(router);
app.use('/images', imageRouter);                                // kyw



server.listen(port, () => console.log(`Server has started on port ${port}`));

WebSocket(server, app);