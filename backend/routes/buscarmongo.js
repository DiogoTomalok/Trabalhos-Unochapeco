const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome_usuario: String,
  senha_usuario: String,
  cpf_cliente: String,
  valor_usuario: Number,
}, { collection: 'usuarios' });

const User = mongoose.model('User', userSchema);

router.post('/login', async (req, res) => {
  const { cpf, senha } = req.body;
  try {
    const user = await User.findOne({ cpf_cliente: cpf });
    if (!user) {
      return res.status(404).send('Usuário não encontrado');
    }
    if (user.senha_usuario !== senha) {
      return res.status(401).send('Senha incorreta');
    }
    res.json(user); // Retorna todos os dados do usuário
  } catch (err) {
    res.status(500).send('Erro ao fazer login');
  }
});

module.exports = router;
