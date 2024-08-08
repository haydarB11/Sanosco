const { CartService } = require('../../services/CartService');
const { OrderService } = require('../../services/OrderService');
const { OrderItemService } = require('../../services/OrderItemService');
const { ItemService } = require('../../services/ItemService');
const { sequelize } = require('../../models');
const { UserService } = require('../../services/UserService');


module.exports = {

    addOrderWithItsItems: async (req, res) => {
        const data = req.body;
        data.user_id = req.user.id;
        const t = await sequelize.transaction();
        try {
            const itemIds = data.items.map(item => item.item_id);
            const items = await ItemService.getManyItems(itemIds);
            let payment = 0;
            items.data.forEach(item => {
                const foundItem = data.items.find(requestItem => requestItem.item_id == item.id);
                if (item.offers.length > 0) {
                    payment += foundItem.count * (item.price - item.price * item?.offers[0].discount);
                } else {
                    payment += foundItem.count * item.price;
                }
            });
            data.payment = payment;
            const newOrder = await new OrderService(data).add({ transaction: t });
            const orderItemsData = data.items.map(item => ({
                order_id: newOrder.data.id,
                item_id: item.item_id,
                count: item.count
            }));
            let shouldReturn = false;
            if (shouldReturn) {
                await t.rollback();
                return;
            } else {
                const orderItems = await OrderItemService.addMany(orderItemsData, { transaction: t });
                const deletedCart = await CartService.deleteMyOwn(data.user_id, { transaction: t });
                await t.commit();
                res.status(deletedCart.status).send({
                    data: 'order added successfully',
                });
            }

        } catch (error) {
            await t.rollback();
            res.status(500).send({
                data: 'An error occurred'
            });
        }
    },

    addOrderWithItsItemsWithOutDeletingCart: async (req, res) => {
        const data = req.body;
        data.user_id = req.user.id;
        const t = await sequelize.transaction();
        try {
            const itemIds = data.items.map(item => item.item_id);
            const items = await ItemService.getManyItems(itemIds);
            let payment = 0;
            items.data.forEach(item => {
                const foundItem = data.items.find(requestItem => requestItem.item_id == item.id);
                if (item.offers.length > 0) {
                    payment += foundItem.count * (item.price - item.price * item?.offers[0].discount);
                } else {
                    payment += foundItem.count * item.price;
                }
            });
            data.payment = payment;
            const newOrder = await new OrderService(data).add({ transaction: t });
            const orderItemsData = data.items.map(item => ({
                order_id: newOrder.data.id,
                item_id: item.item_id,
                count: item.count
            }));
            let shouldReturn = false;
            if (shouldReturn) {
                await t.rollback();
                return;
            } else {
                const orderItems = await OrderItemService.addMany(orderItemsData, { transaction: t });
                await t.commit();
                res.status(orderItems.status).send({
                    data: 'order added successfully',
                });
            }

        } catch (error) {
            await t.rollback();
            res.status(500).send({
                data: 'An error occurred'
            });
        }
    },

    reOrderOrderWithItsItems: async (req, res) => {
        const data = req.body;
        data.user_id = req.user.id;
        const t = await sequelize.transaction();
        try {
            const order = await OrderService.getById(req.params.order_id);
            const itemIds = order.data.order_items.map(item => item.item_id);
            const items = await ItemService.getManyItems(itemIds);
            let payment = 0;
            console.log();
            items.data.forEach(item => {
                const foundItem = order.data.order_items.find(requestItem => requestItem.item_id == item.id);
                if (item.offers.length > 0) {
                    payment += foundItem.count * (item.price - item.price * item?.offers[0].discount);
                } else {
                    payment += foundItem.count * item.price;
                }
            });
            data.payment = payment;
            data.position = order.data.position;
            const newOrder = await new OrderService(data).add({ transaction: t });
            const orderItemsData = order.data.order_items.map(item => ({
                order_id: newOrder.data.id,
                item_id: item.item_id,
                count: item.count
            }));
            const orderItems = await OrderItemService.addMany(orderItemsData, { transaction: t });
            await t.commit();
            return res.status(orderItems.status).send({
                data: 'order added successfully',
            });

        } catch (error) {
            await t.rollback();
            res.status(500).send({
                data: 'An error occurred'
            });
        }
    },

    getMyOrders: async (req, res) => {
        const result = await OrderService.get(req.user.id, req.query?.language);
        const user = await UserService.getById(req.user.id);
        let data = {};
        let allData = [];
        result.data?.forEach(order => {
            order?.order_items.forEach(orderItem => {
                orderItem.item.setDataValue('is_favorite', orderItem.item.favorite.length > 0 ? true : false);
                delete orderItem.item.price;
            });
            if (user.data?.country == 'Syria' && user.data?.type != 'promoter') {
                delete order.dataValues.payment;
                order?.order_items.forEach(orderItem => {
                    orderItem.item.setDataValue('is_favorite', orderItem.item.favorite.length > 0 ? true : false);

                    delete orderItem.item.dataValues.price;
                    delete orderItem.item.dataValues.name_ar;
                    delete orderItem.item.dataValues.description_ar;

                });
                data = order?.order_items.length > 0 ? {...order?.toJSON(), shipping: 0} : {};
                allData.push(data);
                data = {};
            } else {
                order?.order_items.forEach(orderItem => {
                    orderItem.item.setDataValue('is_favorite', orderItem.item.favorite.length > 0 ? true : false);
                    delete orderItem.item.dataValues.name_ar;
                    delete orderItem.item.dataValues.description_ar;
                });
                data = order?.order_items.length > 0 ? {...order?.toJSON(), shipping: 0} : {};
                allData.push(data);
                data = {};
            }
        });
        res.status(result.status).send({
            data: allData,
        });
    },

    getOrderById: async (req, res) => {
        const result = await OrderService.getByIdForUser(req.params.order_id, req?.user?.id, req.query?.language);
        console.log(result.data);
        const user = await UserService.getById(req.user.id);
        let data = {};
            result.data?.order_items.forEach(orderItem => {
                orderItem.item.setDataValue('is_favorite', orderItem.item.favorite.length > 0 ? true : false);
                delete orderItem.item.price;
            });
            if (user.data?.country == 'Syria' && user.data?.type != 'promoter') {
                delete result.data.dataValues.payment;
                result.data?.order_items.forEach(orderItem => {
                    orderItem.item.setDataValue('is_favorite', orderItem.item.favorite.length > 0 ? true : false);

                    delete orderItem.item.dataValues.price;
                    delete orderItem.item.dataValues.name_ar;
                    delete orderItem.item.dataValues.description_ar;

                });
                data = result.data?.order_items.length > 0 ? {...result.data?.toJSON(), shipping: 0} : {};
            } else {
                result.data?.order_items.forEach(orderItem => {
                    orderItem.item.setDataValue('is_favorite', orderItem.item.favorite.length > 0 ? true : false);
                    delete orderItem.item.dataValues.name_ar;
                    delete orderItem.item.dataValues.description_ar;
                });
                data = result.data?.order_items.length > 0 ? {...result.data?.toJSON(), shipping: 0} : {};
            }
        res.status(result.status).send({
            data: data,
        });
    },
    
    editOrder: async (req, res) => {
        const data = req.body;
        data.id = req.params.order_id;
        const result = await OrderService.edit(data);
        res.status(result.status).send({
            data: result.data,
        });
    },
    
    cancelOrder: async (req, res) => {
        const data = req.body;
        data.id = req.params.order_id;
        data.status = 3;
        const order = await OrderService.getById(data.id);
        if (order.data.status == 0) {
            const result = await OrderService.edit(data);
            return res.status(result.status).send({
                data: result.data,
            });
        } else {
            return res.status(404).send({
                data: 'you cannot cancel this request because it is not pending',
            });
        }
    },

}