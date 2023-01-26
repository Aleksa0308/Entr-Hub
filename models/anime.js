'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Anime extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Anime.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    manga: {
      type: DataTypes.STRING,
      allowNull: false
    },
    epizodes: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'Anime',
  });
  return Anime;
};