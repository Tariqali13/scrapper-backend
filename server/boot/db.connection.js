const Credentials = require('../config/db.credentials.json');
const Sequelize = require('sequelize');

const credentials = Credentials.development;
const Db = new Sequelize(credentials.database, credentials.user, credentials.password, {
  host: credentials.host,
  dialect: 'postgres'
});

module.exports = Db;