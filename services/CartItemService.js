const { 
    Cart,
    Item,
    CartItem,
} = require('../models');
const httpStatus = require('../utils/httpStatus');
const { Op } = require('sequelize');

class CartItemService {

    constructor(data) {
        this.count = data.count;
        this.cart_id = data.cart_id;
        this.item_id = data.item_id;
    }

    static async addMany(data, option) {
        try {
            const cartItems = await CartItem.bulkCreate(data, option);
            return {
                data: cartItems,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    async add() {
        try {
            const cartItems = await CartItem.create(this);
            return {
                data: cartItems,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAll() {
        try {
            const orders = await Order.findAll({});
            return {
                data: orders,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getItemOneForOneCart(data) {
        try {
            const cartItem = await CartItem.findOne({
                where: {
                    cart_id: data.cart_id,
                    item_id: data.item_id
                }
            });
            return {
                data: cartItem,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async edit(data) {
        try {
            const cartItem = await CartItem.findByPk(data.cart_item_id);
            cartItem.count += data.count;
            await cartItem.save();
            return {
                data: cartItem,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async putNewCount(data) {
        try {
            const cartItem = await CartItem.findByPk(data.cart_item_id);
            cartItem.count = data.count;
            await cartItem.save();
            return {
                data: cartItem,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async delete(data) {
        try {
            const deletedItem = await CartItem.destroy({
                where: {
                    cart_id: data.cart_id,
                    item_id: data.item_id
                }
            });
            if (deletedItem === 1) {
                return {
                    data: 'deleted successfully',
                    status: httpStatus.OK
                };
            } else {
                return {
                    data: 'something went wrong',
                    status: httpStatus.BAD_REQUEST
                };
            }
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async deleteMany(data) {
        try {
            const deletedItem = await CartItem.destroy({
                where: {
                    cart_id: data.cart_id,
                    item_id: {
                        [Op.in]: data.ids
                    }
                }
            });
            if (deletedItem >= 1) {
                return {
                    data: 'deleted successfully',
                    status: httpStatus.OK
                };
            } else {
                return {
                    data: 'something went wrong',
                    status: httpStatus.BAD_REQUEST
                };
            }
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

}

module.exports = { CartItemService };