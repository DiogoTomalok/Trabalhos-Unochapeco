const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const buscarmongoRouter = require('./routes/buscarmongo');
const criarmongoRouter = require('./routes/criarmongo');
const criarContaRouter = require('./routes/criarconta');
const buscarDadosRouter = require('./routes/buscardados');
const alterarDadosRouter = require('./routes/alterardados');
const dadosMongoRouter = require('./routes/dadosmongo');
const produtomongoRouter = require('./routes/produtomongo');
const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/webdado', { useUnifiedTopology: true })
  .then(() => console.log('Conexão com o MongoDB estabelecida com sucesso!'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Adiciona suporte para JSON no body-parser
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/index.html'));
});

// Rotas para as páginas estáticas
app.get('/buscarmongo.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/buscarmongo.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/login.html'));
});

app.get('/criarmongo.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/criarmongo.html'));
});

app.get('/criarconta.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/criarconta.html'));
});

app.get('/buscardados.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/buscardados.html'));
});

app.get('/produto.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/produto.html'));
});

app.get('/produto2.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/produto2.html'));
});

// Rotas para as outras funcionalidades
app.use('/api/buscarmongo', buscarmongoRouter);
app.use('/api/criarmongo', criarmongoRouter);
app.use('/criarconta', criarContaRouter);
app.use('/buscar', buscarDadosRouter);
app.use('/alterardados', alterarDadosRouter);
app.use('/api/dadosmongo', dadosMongoRouter); 
app.use('/api/produtomongo', produtomongoRouter);


// Rota para redirecionamento
app.get('/view/data', (req, res) => {
  res.redirect('/data');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
