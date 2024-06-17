// backend/routes/login.js

const express = require('express');
const Usuario = require('../models/usuario'); // Importando o modelo de usuário

const router = express.Router();

// Rota de login
router.post('/login', async (req, res) => {
  // Seu código de autenticação aqui usando o modelo Usuario
});

module.exports = router;
