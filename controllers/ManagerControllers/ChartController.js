const { OrderService } = require('../../services/OrderService');
const { CategoryService } = require('../../services/CategoryService');
const { ItemService } = require('../../services/ItemService');
const { CollectionService } = require('../../services/CollectionService');
const { BrandService } = require('../../services/BrandService');


module.exports = {

    getAllCharts: async (req, res) => {

        const orders = await OrderService.getCountForEachDayLastMonth();
        const factoredOrders = [];
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));

        for (let day = 0; day < 30; day++) {
            const currentDate = new Date(thirtyDaysAgo.getTime() + (day * 24 * 60 * 60 * 1000));
            const matchingOrder = orders.data.find(
                (order) => new Date(order.getDataValue('created_at')).toISOString().slice(0, 10) ==  currentDate.toISOString().slice(0, 10)
            );
            factoredOrders.push({
                created_at: matchingOrder ? matchingOrder.getDataValue('created_at') : currentDate.toISOString().slice(0, 10),
                count: matchingOrder ? matchingOrder.getDataValue('count') : 0,
            });
        }
        const categories = await CategoryService.getCount();
        const items = await ItemService.getCount();
        const brands = await BrandService.getCount();
        const collections = await CollectionService.getCount();
        res.status(200).send({
            data: {
                orders: factoredOrders,
                categories: categories.data,
                items: items.data,
                brands: brands.data,
                collections: collections.data
            },
        });
    },

}