const express = require('express');
const router = express.Router();
const Produto = require('../models/produto');

// Rota para criar um novo produto
router.post('/', async (req, res) => {
  const { nome_produto, valor_produto, id_produto, codigo_produto } = req.body;

  // Validação básica dos dados de entrada
  if (!nome_produto || !valor_produto || !id_produto || !codigo_produto) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  try {
    const novoProduto = new Produto({
      nome_produto,
      valor_produto,
      id_produto,
      codigo_produto
    });

    await novoProduto.save();
    res.status(201).json({ message: 'Produto criado com sucesso!', produto: novoProduto });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar produto', error });
  }
});

module.exports = router;
