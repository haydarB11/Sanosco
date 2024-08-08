'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Advertisement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'manager_id',
        as: 'manager',
        onDelete: 'CASCADE',
        onUpdate:'CASCADE',
      });
      this.belongsTo(models.Item, {
        foreignKey: 'item_id',
        as: 'item',
        onDelete: 'CASCADE',
        onUpdate:'CASCADE',
      });
    }
  }
  Advertisement.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    name_ar: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      // defaultValue: ''
    },
    title_ar: {
      type: DataTypes.STRING,
      allowNull: false,
      // defaultValue: ''
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      // defaultValue: ''
    },
    content_ar: {
      type: DataTypes.STRING,
      allowNull: false,
      // defaultValue: ''
    },
    is_show: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    underscored: true,
    tableName: 'advertisements',
    modelName: 'Advertisement',
  });
  return Advertisement;
};