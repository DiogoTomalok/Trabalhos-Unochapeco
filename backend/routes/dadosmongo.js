const express = require('express');
const router = express.Router();
const Produto = require('../models/produto');

// Rota para inserir um novo produto
router.post('/', async (req, res) => {
  const { nome, valor, id, codigo, imagemhome, imagemarray } = req.body;

  // Validação básica dos dados de entrada
  if (!nome || !valor || !id || !codigo || !imagemhome) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  try {
    const novoProduto = new Produto({
      nome,
      valor,
      id,
      codigo,
      imagemhome,
      imagemarray // Adicionando o array de imagens
    });

    await novoProduto.save();
    res.status(201).json({ message: 'Produto inserido com sucesso!', Produto: novoProduto });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao inserir produto', error });
  }
});

module.exports = router;
