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

router.get('/:cpf', async (req, res) => {
  const cpf = req.params.cpf;
  try {
    const user = await User.findOne({ cpf_cliente: cpf });
    if (!user) {
      return res.status(404).send('Usuário não encontrado');
    }
    res.json(user);
  } catch (err) {
    res.status(500).send('Erro ao buscar usuário');
  }
});

module.exports = router;
