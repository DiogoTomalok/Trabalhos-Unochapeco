'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Postar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Postar.init({
    title: DataTypes.STRING,
    post: DataTypes.TEXT,
    nome: DataTypes.STRING,
    idade: DataTypes.INTEGER,
    descricao: DataTypes.TEXT,
    compra: DataTypes.DECIMAL,
    cpf: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Postar',
  });
  return Postar;
};