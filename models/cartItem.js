'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Item, {
        foreignKey: 'item_id',
        as: 'item',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      this.belongsTo(models.Cart, {
        foreignKey: 'cart_id',
        as: 'cart',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  CartItem.init({
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    underscored: true,
    tableName: 'cart_items',
    modelName: 'CartItem',
  });
  return CartItem;
};