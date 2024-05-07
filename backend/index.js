const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./routes/posts');
const { Sequelize } = require('sequelize');

// Configuração da conexão com o banco de dados PostgreSQL usando Sequelize
const sequelize = new Sequelize({
  username: 'postgres',
  password: 'postgres',
  database: 'meu_banco',
  host: 'localhost',
  dialect: 'postgres',
});

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importa as rotas do arquivo posts.js
app.use('/posts', Post);

// Sincroniza o modelo Post com o banco de dados
sequelize.sync().then(() => {
    console.log('Só bota pra dentro!!!!!!!!\nMas com carinho. \u2764\ufe0f \u2764\ufe0f \u2764\ufe0f');

}).catch((error) => {
  console.error('Não apareça essa msg porfavor!!! \n Não apareça essa msg porfavor!!! \n Não apareça essa msg porfavor!!! \n', error);
});

const port = process.env.PORT || 8989;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
