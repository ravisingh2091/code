const Sequelize = require('sequelize');
const config = require('../lib/config');

const db = {};

db.connection = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    dialect: 'mysql'
});

db.models = require('./models')(db.connection, Sequelize);

db.Sequelize = Sequelize;

db.connect = (callback) => {
    db.connection.authenticate()
        .then(() => callback())
        .catch((err) => callback(err)
        );
};

module.exports = db;
