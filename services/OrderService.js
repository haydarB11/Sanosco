const { 
    Order,
    User,
    OrderItem,
    Item,
    ItemImage,
    Favorite,
    Sequelize,
} = require('../models');
const httpStatus = require('../utils/httpStatus');
const sequelize = require('sequelize');
const Op = sequelize.Op;

class OrderService {

    constructor(data) {
        this.payment = data.payment;
        this.status = data.status;
        this.position = data.position;
        this.user_id = data.user_id;
    }

    async add(option) {
        try {
            const order = await Order.create(this, option);
            return {
                data: order,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getCountForEachDayLastMonth() {
        try {
            const today = new Date();
            const lastMonth = new Date();
            lastMonth.setMonth( lastMonth.getMonth() - 1);
            const order = await Order.findAll({
                attributes: [        
                    [sequelize.fn('date', sequelize.col('created_at')), 'created_at'],
                    [sequelize.fn('COALESCE', sequelize.fn('count', 'id'), 0), 'count'],
                ],
                where: {
                    created_at: {
                        [Op.between]: [lastMonth, today]
                    }
                },
                group: [sequelize.fn('date', sequelize.col('created_at'))],
                // row: true
            });
            return {
                data: order,
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
            const orders = await Order.findAll({
                attributes: {
                    include: [
                        [
                            Sequelize.literal(`CASE
                            WHEN status = 0 THEN 'pending'
                            WHEN status = 1 THEN 'accepted'
                            WHEN status = 2 THEN 'rejected'
                            WHEN status = 3 THEN 'canceled'
                            ELSE ''
                            END`),
                            'status',
                        ],
                    ],
                },
                include: [
                    {
                        model: User,
                        as: 'user'
                    },
                    {
                        model: OrderItem,
                        as: 'order_items',
                        include: [
                            {
                                model: Item,
                                as: 'item'
                            }
                        ]
                    }
                ]
            });
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

    static async get(user_id, language = 'ar') {
        try {
            const name = language === 'ar' ? 'name_ar' : 'name';
            const orders = await Order.findAll({
                attributes: {
                    include: [
                        [
                            Sequelize.literal(`CASE
                            WHEN status = 0 THEN 'pending'
                            WHEN status = 1 THEN 'accepted'
                            WHEN status = 2 THEN 'rejected'
                            WHEN status = 3 THEN 'canceled'
                            ELSE ''
                            END`),
                            'status',
                        ],
                    ],
                },
                include: [
                    {
                        required: true,
                        model: OrderItem,
                        as: 'order_items',
                        include: [
                            {
                                // required: true,
                                attributes: {
                                    include: [
                                        [sequelize.col(name), 'name']
                                    ]
                                },
                                model: Item,
                                as: 'item',
                                include: [
                                    {
                                        model: ItemImage,
                                        as: 'item_images'
                                    },
                                    {
                                        required: false,
                                        model: Favorite,
                                        as: 'favorite',
                                        where: {
                                            user_id: user_id
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ],
                where: {
                    user_id: user_id
                }
            });
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

    static async getByIdForUser(order_id, user_id = null, language = 'an') {
        try {
            const name = language === 'ar' ? 'name_ar' : 'name';
            const orders = await Order.findOne({
                attributes: {
                    include: [
                        [
                            Sequelize.literal(`CASE
                            WHEN status = 0 THEN 'pending'
                            WHEN status = 1 THEN 'accepted'
                            WHEN status = 2 THEN 'rejected'
                            WHEN status = 3 THEN 'canceled'
                            ELSE ''
                            END`),
                            'status',
                        ],
                    ],
                },
                include: [
                    {
                        model: OrderItem,
                        as: 'order_items',
                        include: [
                            {
                                attributes: {
                                    include: [
                                        [sequelize.col(name), 'name']
                                    ]
                                },
                                model: Item,
                                as: 'item',
                                include: [
                                    {
                                        model: ItemImage,
                                        as: 'item_images'
                                    },
                                    {
                                        required: false,
                                        model: Favorite,
                                        as: 'favorite',
                                        where: {
                                            user_id: user_id
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ],
                where: {
                    id: order_id
                }
            });
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

    static async getById(order_id) {
        try {
            const orders = await Order.findOne({
                attributes: {
                    // include: [
                    //     [
                    //         Sequelize.literal(`CASE
                    //         WHEN status = 0 THEN 'pending'
                    //         WHEN status = 1 THEN 'accepted'
                    //         WHEN status = 2 THEN 'rejected'
                    //         WHEN status = 3 THEN 'canceled'
                    //         ELSE ''
                    //         END`),
                    //         'status',
                    //     ],
                    // ],
                },
                include: [
                    {
                        model: OrderItem,
                        as: 'order_items',
                        include: [
                            {
                                model: Item,
                                as: 'item',
                            }
                        ]
                    }
                ],
                where: {
                    id: order_id
                }
            });
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

    static async edit(data, option) {
        try {
            const order = await Order.findByPk(data.id, option);
            order.status = data.status;
            await order.save();
            return {
                data: order,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async delete(id) {
        try {
            const order = await Order.destroy({
                where: {
                    id: id
                }
            });
            if (order === 1) {
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

module.exports = { OrderService };