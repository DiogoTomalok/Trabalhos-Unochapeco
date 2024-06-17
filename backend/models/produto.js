const mongoose = require('mongoose');

// Definir o esquema do produto
const produtoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  valor: { type: Number, required: true },
  id: { type: String, required: true },
  codigo: { type: String, required: true },
  imagemhome: { type: String, required: true },
  imagemarray: { type: [String], required: true } // Campo array para múltiplas imagens
});

// Criar o modelo 'Produto' baseado no esquema
const Produto = mongoose.model('Produto', produtoSchema);

module.exports = Produto;
