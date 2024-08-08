'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Item, {
        foreignKey: 'brand_id',
        as: 'items',
        onDelete: 'CASCADE',
        onUpdate:'CASCADE',
      });
    }
  }
  Brand.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name_ar: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    is_show: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    underscored: true,
    tableName: 'brands',
    modelName: 'Brand',
  });
  return Brand;
};