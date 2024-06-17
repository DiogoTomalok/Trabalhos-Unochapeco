/*const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nome_usuario: String,
  senha_usuario: String,
  cpf_cliente: String,
  valor_usuario: Number,
}, { versionKey: false });

const Usuario = mongoose.model('Usuario', UsuarioSchema);

module.exports = Usuario;*/


const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nome_usuario: String,
  senha_usuario: String,
  cpf_cliente: String,
  valor_usuario: Number,
}, { versionKey: false });

const Usuario = mongoose.model('Usuario', UsuarioSchema);

module.exports = Usuario;



