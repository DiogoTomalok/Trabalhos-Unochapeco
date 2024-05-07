const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');

const Post = sequelize.define('Post', {
  title: Sequelize.STRING,
  post: Sequelize.TEXT,
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
});

module.exports = Post;
