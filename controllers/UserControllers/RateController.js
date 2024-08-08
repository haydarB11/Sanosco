const { ItemService } = require('../../services/ItemService');
const { OrderItemService } = require('../../services/OrderItemService');
const { RateService } = require('../../services/RateService');


module.exports = {

    rateItem: async (req, res) => {
        const data = req.body;
        data.user_id = req.user.id;
        const oldRate = await RateService.getForOneItemForOneUser(data);
        if (oldRate.data?.id) {
            res.status(400).send({
                data: 'you have already rate this item',
            });
            return;
        }
        const orderItems = await OrderItemService.getForOneUserForOneItem(data.user_id, data.item_id);
        if (orderItems.data?.id) {
            const result = await new RateService(data).add();
            const item = await ItemService.editRate(data);
            return res.status(result.status).send({
                data: result.data,
            });
        } else {     
            res.status(400).send({
                data: 'you should order the item to rate it',
            });
            return;
        }
    },

}