'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Item, {
        foreignKey: 'category_id',
        as: 'items',
        onDelete: 'CASCADE',
        onUpdate:'CASCADE',
      });
      this.hasMany(models.Category, {
        foreignKey: 'category_id',
        as: 'categories',
        onDelete: 'CASCADE',
        onUpdate:'CASCADE',
      });
      this.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category',
        onDelete: 'CASCADE',
        onUpdate:'CASCADE',
      });
    }
  }
  Category.init({
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
      allowNull: false
    },
    is_show: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    underscored: true,
    tableName: 'categories',
    modelName: 'Category',
  });
  return Category;
};