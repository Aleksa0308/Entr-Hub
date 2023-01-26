'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class manga extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  manga.init({
    name: {
      type: DataTypes.STRING,
      allowNull:false
    },
    author: {
      type: DataTypes.STRING,
      allowNull:false
    },
    theme: {
      type: DataTypes.STRING,
      allowNull:false
    },
    status: {
      type: DataTypes.STRING,
      allowNull:false
    },
    image: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'manga',
  });
  return manga;
};