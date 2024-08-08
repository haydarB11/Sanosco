'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Offer extends Model {
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
        onUpdate:'CASCADE',
      });
    }
  }
  Offer.init({
    // title: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   defaultValue: ''
    // },
    // title_ar: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   defaultValue: ''
    // },
    discount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    starting_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    ending_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    underscored: true,
    tableName: 'offers',
    modelName: 'Offer',
  });
  return Offer;
};