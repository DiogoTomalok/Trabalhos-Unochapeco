// backend/routes/posts.js
const express = require('express');
const router = express.Router();
const { Post } = require('../models');

// Rota para criar uma nova postagem
router.post('/api/posts', async (req, res) => {
    try {
        const { title, content } = req.body;
        const newPost = await Post.create({ title, content });
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Erro ao criar postagem:', error);
        res.status(500).json({ error: 'Erro ao criar postagem' });
    }
});

module.exports = router;
