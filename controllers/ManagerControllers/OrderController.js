const { OrderItemService } = require('../../services/OrderItemService');
const { OrderService } = require('../../services/OrderService');
const { UserService } = require('../../services/UserService');
const { sequelize } = require('../../models');
const { ItemService } = require('../../services/ItemService');


module.exports = {

    deleteOrder: async (req, res) => {
        const result = await OrderService.delete(req.params.order_id);
        res.status(result.status).send({
            data: result.data,
        });
    },
    
    editOrder: async (req, res) => {
        const data = req.body;
        data.id = req.params.order_id;
        const t = await sequelize.transaction();
        try {
            const result = await OrderService.edit(data, { transaction: t });
            const orderItems = await OrderItemService.getAllForOneOrder(data.id);
            let shouldReturn = false;
            for (const item of orderItems.data) {
                const itemData = {decrease: item.count, id: item.item_id};
                const editItem = await ItemService.decreaseStorage(itemData, { transaction: t });
                if (editItem.status == 400) {
                    shouldReturn = true;
                    res.status(400).send({
                        data: "Insufficient Storage"
                    });
                    break;
                }      
            }
            if (shouldReturn) {
                await t.rollback();
                return;
            }
            // const token = await UserService.getTokenForOneUser(result.data.user_id);
            // if (token.length > 0) {
            //     sendNotificationsMulticast(token, title, text)
            // }
            res.status(result.status).send({
                data: result.data,
            });
        } catch (error) {
            await t.rollback();
            res.status(500).send({
                data: 'error editing order',
            });
        }
    },

    getAllOrders: async (req, res) => {
        const result = await OrderService.getAll();
        res.status(result.status).send({
            data: result.data,
        });
    }

}