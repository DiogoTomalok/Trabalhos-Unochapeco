const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');

// Rota para criar um novo usuário
router.post('/', async (req, res) => {
  const { nome_usuario, senha_usuario, cpf_cliente, valor_usuario } = req.body;

  // Validação básica dos dados de entrada
  if (!nome_usuario || !senha_usuario || !cpf_cliente || !valor_usuario) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  try {
    const novoUsuario = new Usuario({
      nome_usuario,
      senha_usuario,
      cpf_cliente,
      valor_usuario
    });

    await novoUsuario.save();
    res.status(201).json({ message: 'Usuário criado com sucesso!', usuario: novoUsuario });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário', error });
  }
});

module.exports = router;
