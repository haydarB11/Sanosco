'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
      this.hasMany(models.CartItem, {
        foreignKey: 'cart_id',
        as: 'cart_items',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Cart.init({
    
  }, {
    sequelize,
    underscored: true,
    tableName: 'carts',
    modelName: 'Cart',
  });
  return Cart;
};