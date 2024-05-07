const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  username: 'postgres',
  password: 'postgres',
  database: 'meu_banco',
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
