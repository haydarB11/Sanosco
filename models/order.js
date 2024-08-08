'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
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
      this.hasMany(models.OrderItem, {
        foreignKey: 'order_id',
        as: 'order_items',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Order.init({
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    payment: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
  }, {
    sequelize,
    underscored: true,
    tableName: 'orders',
    modelName: 'Order',
  });
  return Order;
};