const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Modelo mongoose para o documento 'produtos'
const Produto = require('../models/produto');

// Rota para buscar todos os produtos
router.get('/', async (req, res) => {
    try {
        // Conectando ao MongoDB
        await mongoose.connect('mongodb://localhost:27017/webdado', { useNewUrlParser: true, useUnifiedTopology: true });

        // Buscando todos os produtos no banco de dados
        const produtos = await Produto.find();

        // Respondendo com os produtos encontrados
        res.json(produtos);
    } catch (error) {
        // Capturando e respondendo em caso de erro
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
