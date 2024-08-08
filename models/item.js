'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'manager_id',
        as: 'manager'
      });
      this.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category'
      });
      this.belongsTo(models.Brand, {
        foreignKey: 'brand_id',
        as: 'brand'
      });
      this.hasMany(models.ItemImage, {
        foreignKey: 'item_id',
        as: 'item_images',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      this.hasMany(models.OrderItem, {
        foreignKey: 'item_id',
        as: 'order_items',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      this.hasMany(models.CartItem, {
        foreignKey: 'item_id',
        as: 'cart_items',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      this.belongsTo(models.Collection, {
        foreignKey: 'collection_id',
        as: 'collection',
        onDelete: 'CASCADE',
        onUpdate:'CASCADE',
      });
      this.hasMany(models.Rate, {
        foreignKey: 'item_id',
        as: 'rates',
        onDelete: 'CASCADE',
        onUpdate:'CASCADE',
      });
      this.hasMany(models.Advertisement, {
        foreignKey: 'item_id',
        as: 'advertisements',
        onDelete: 'CASCADE',
        onUpdate:'CASCADE',
      });
      this.hasMany(models.Offer, {
        foreignKey: 'item_id',
        as: 'offers',
        onDelete: 'CASCADE',
        onUpdate:'CASCADE',
      });
      this.hasMany(models.Favorite, {
        foreignKey: 'item_id',
        as: 'favorite',
        onDelete: 'CASCADE',
        onUpdate:'CASCADE',
      });
    }
  }
  Item.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name_ar: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    },
    description_ar: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    },
    is_show: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    measure: {
      type: DataTypes.STRING,
      allowNull: false
    },
    paracode: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false
    },
    storage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    rate: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    rate_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
  }, {
    sequelize,
    underscored: true,
    tableName: 'items',
    modelName: 'Item',
  });
  return Item;
};