const { 
    Order,
    Item,
    OrderItem,
} = require('../models');
const httpStatus = require('../utils/httpStatus');

class OrderItemService {

    constructor(data) {
        this.count = data.count;
        this.order_id = data.order_id;
        this.item_id = data.item_id;
    }

    static async addMany(data, option) {
        try {
            const orderItems = await OrderItem.bulkCreate(data, option);
            return {
                data: orderItems,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllForOneOrder(order_id) {
        try {
            const orderItems = await OrderItem.findAll({
                where: {
                    order_id: order_id
                }
            });
            return {
                data: orderItems,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getForOneUserForOneItem(user_id, item_id) {
        try {
            const orderItems = await OrderItem.findOne({
                include: [
                    {
                        required: true,
                        model: Order,
                        as: 'order',
                        where: {
                            user_id: user_id
                        }
                    }
                ],
                where: {
                    item_id: item_id
                }
            });
            return {
                data: orderItems,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    // static async getAllForOneUser(user_id) {
    //     try {
    //         const orderItems = await OrderItem.findAll({
    //             include: [
    //                 {
    //                     model: Order,
    //                     as: 'order',
    //                     where: {
    //                         user_id: user_id
    //                     }
    //                 }
    //             ]
    //         });
    //         return {
    //             data: orderItems,
    //             status: httpStatus.OK
    //         };
    //     } catch (error) {
    //         return {
    //             data: error.message,
    //             status: httpStatus.BAD_REQUEST
    //         };
    //     }
    // }

}

module.exports = { OrderItemService };