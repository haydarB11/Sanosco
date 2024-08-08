'use strict';
const {user_type, gender} = require('./enum.json');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    
    generateToken(){
      const token = jwt.sign({ id: this.id, user : this.user }, process.env.SECRETKEY);
      return token;
    }
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Order, {
        foreignKey: 'user_id',
        as: 'orders'
      });
      this.hasMany(models.Cart, {
        foreignKey: 'user_id',
        as: 'carts'
      });
      this.hasMany(models.Advertisement, {
        foreignKey: 'manager_id',
        as: 'advertisements',
        onDelete: 'CASCADE',
        onUpdate:'CASCADE',
      });
      this.hasMany(models.Rate, {
        foreignKey: 'user_id',
        as: 'rates',
        onDelete: 'CASCADE',
        onUpdate:'CASCADE',
      });
      this.hasMany(models.Favorite, {
        foreignKey: 'user_id',
        as: 'favorites',
        onDelete: 'CASCADE',
        onUpdate:'CASCADE',
      });
      this.hasMany(models.NotificationUser, {
        foreignKey: 'user_id',
        as: 'notification_users'
      });
    }
  }
  User.init({
    // first_name: {
    //   type: DataTypes.STRING,
    //   allowNull: false
    // },
    // last_name: {
    //   type: DataTypes.STRING,
    //   allowNull: false
    // },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "email already used",
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "phone number already used"
      }
    },
    type: {
      type: DataTypes.ENUM,
      values: user_type,
      defaultValue: 'user',
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    is_activated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      // defaultValue: true
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "ar"
    }

  }, {
    sequelize,
    underscored: true,
    tableName: 'users',
    modelName: 'User',
  });
  return User;
};