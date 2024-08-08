'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rate extends Model {
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
        onDelete: 'CASCADE',
        onUpdate:'CASCADE',
      });
      this.belongsTo(models.Item, {
        foreignKey: 'item_id',
        as: 'Item',
        onDelete: 'CASCADE',
        onUpdate:'CASCADE',
      });
    }
  }
  Rate.init({
    rate: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  }, {
    sequelize,
    underscored: true,
    tableName: 'rates',
    modelName: 'Rate',
  });
  return Rate;
};