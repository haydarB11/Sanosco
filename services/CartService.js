const { 
    Cart,
    CartItem,
    ItemImage,
    Item,
    Offer,
    Favorite,
    sequelize,
} = require('../models');
const httpStatus = require('../utils/httpStatus');
const { Op } = require('sequelize');

class CartService {

    constructor(data) {
        this.user_id = data.user_id;
    }

    async add(option) {
        try {
            const cart = await Cart.create(this, option);
            return {
                data: cart,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async get(id, language = 'ar') {
        try {
            const name = language === 'ar' ? 'name_ar' : 'name';
            const description = language === 'ar' ? 'description_ar' : 'description';
            const today = new Date();
            // console.log(today);
            const cart = await Cart.findOne({
                include: [
                    {
                        model: CartItem,
                        as: 'cart_items',
                        include: [
                            {
                                attributes: [
                                    'id',
                                    'price',
                                    'color',
                                    'measure',
                                    [sequelize.col(name), 'name'],
                                    [sequelize.col(description), 'description'],
                                ],
                                model: Item,
                                as: 'item',
                                include: [
                                    {
                                        model: ItemImage,
                                        as: 'item_images'
                                    },
                                    {
                                        required: false,
                                        model: Offer,
                                        as: 'offers',
                                        order: [['id', 'DESC']],
                                        limit: 1,
                                        where: {
                                            starting_date: {
                                                [Op.lte]: today
                                            },
                                            ending_date: {
                                                [Op.gte]: today
                                            }
                                        }
                                    },
                                    {
                                        required: false,
                                        model: Favorite,
                                        as: 'favorite',
                                        where: {
                                            user_id: +id
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ],
                where: {
                    user_id: +id
                },
                order: [['id', 'DESC']]
            });
            return {
                data: cart,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    // static async getAll() {
    //     try {
    //         const orders = await Order.findAll({});
    //         return {
    //             data: orders,
    //             status: httpStatus.OK
    //         };
    //     } catch (error) {
    //         return {
    //             data: error.message,
    //             status: httpStatus.BAD_REQUEST
    //         };
    //     }
    // }

    // static async edit(data) {
    //     try {
    //         const order = await Order.findByPk(data.id);
    //         order.status = data.status || order.status;
    //         await order.save();
    //         return {
    //             data: 'updated',
    //             status: httpStatus.OK
    //         };
    //     } catch (error) {
    //         return {
    //             data: error.message,
    //             status: httpStatus.BAD_REQUEST
    //         };
    //     }
    // }

    // static async delete(id) {
    //     try {
    //         const order = await Order.destroy({
    //             where: {
    //                 id: id
    //             }
    //         });
    //         if (order === 1) {
    //             return {
    //                 data: 'deleted successfully',
    //                 status: httpStatus.OK
    //             };
    //         } else {
    //             return {
    //                 data: 'something went wrong',
    //                 status: httpStatus.BAD_REQUEST
    //             };
    //         }
    //     } catch (error) {
    //         return {
    //             data: error.message,
    //             status: httpStatus.BAD_REQUEST
    //         };
    //     }
    // }

    static async deleteMyOwn(user_id, option) {
        try {
            const cart = await Cart.destroy({
                where: {
                    user_id: user_id
                }
            }, option);
            if (cart >= 0) {
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

module.exports = { CartService };