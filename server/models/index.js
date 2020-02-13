const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Room = require('./room')(sequelize, Sequelize);
db.User = require('./user')(sequelize, Sequelize);
db.ImageInfo = require('./imageInfo')(sequelize, Sequelize);
db.GameData = require('./gameData')(sequelize, Sequelize);

db.Room.hasMany(db.User);
db.User.belongsTo(db.Room);
db.ImageInfo.belongsTo(db.GameData);
db.GameData.hasOne(db.ImageInfo);

module.exports = db;