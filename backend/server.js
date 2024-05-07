// backend/server.js
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware para servir arquivos estáticos do front-end
app.use(express.static(path.join(__dirname, '../frontend')));

// Middleware para processar dados JSON
app.use(express.json());

// Middleware de rotas para posts
const postsRouter = require('./routes/posts');
app.use('/posts', postsRouter);

// Configuração das visualizações (se aplicável)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Outras configurações e inicialização do servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
