const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const loginRouter = require('./routes/login');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/index.html'));
});

app.use('/login', loginRouter);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
