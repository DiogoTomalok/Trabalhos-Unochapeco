const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/Quase Lixo/index');
const viewRouter = require('./routes/Quase Lixo/view');
const buscaRouter = require('./routes/Quase Lixo/busca');
const criarContaRouter = require('./routes/criarconta');
const buscarDadosRouter = require('./routes/buscardados'); 
const alterarDadosRouter = require('./routes/alterardados'); 

const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Adiciona suporte para JSON no body-parser
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/index.html'));
});

app.use('/', indexRouter);
app.use('/view', viewRouter);
app.use('/buscar', buscaRouter);
app.get('/criarconta.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/criarconta.html'));
});
app.get('/buscardados.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/buscardados.html'));
});
app.get('/alterardados.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/alterardados.html'));
});

app.use('/criarconta', criarContaRouter);
app.use('/buscar', buscarDadosRouter);
app.use('/alterardados', alterarDadosRouter);

app.get('/view/data', (req, res) => {
    res.redirect('/data');
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
