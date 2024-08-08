const { FavoriteService } = require('../../services/FavoriteService');
const { ItemService } = require('../../services/ItemService');
const { UserService } = require('../../services/UserService');


module.exports = {

    addToFavorite: async (req, res) => {
        const data = req.params;
        data.user_id = req.user.id;
        const oldFavorite = await FavoriteService.getForItemForOneUser(data); // 104
        if (oldFavorite.data?.id) {
            return res.status(oldFavorite.status).send({
                data: 'you already have it in favorite',
            });
        } else {
            const item = await ItemService.getByIdNoInfo(data.item_id);
            const item_ids = await ItemService.getAllForOneNameNoInfo(item.data.name);
            const factoredFavoriteItem = item_ids.data.map( id => ({
                item_id: id,
                user_id: data.user_id
            }))
            const result = await FavoriteService.addMany(factoredFavoriteItem);
            return res.status(result.status).send({
                data: result.data,
            });
        }
    },

    deleteFromFavorite: async (req, res) => {
        const data = req.params;
        data.user_id = req.user.id;
        const result = await FavoriteService.delete(data);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getMyFavorites: async (req, res) => {
        const data = req.query;
        data.user_id = req.user.id;
        const result = await ItemService.getAllFavoriteForUser(data);
        const user = await UserService.getById(req?.user?.id);

        let items;

        if (user.data?.country == 'Syria' && user.data?.type != 'promoter') {
            items = result.data.map(element => {
                delete element.dataValues.price;
                return {
                    ...element.toJSON(), 
                    is_favorite: element.favorite.length > 0 ? true : false,
                    cart_count: element?.cart_items[0] ? element.cart_items[0].count : 0,
                    measures: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.measure),
                    paracodes: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.paracode),
                    ids: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.id)
                };
            });
        } else {
            items = result.data.map(element => {
                return {
                    ...element.toJSON(), 
                    is_favorite: element.favorite.length > 0 ? true : false,
                    cart_count: element?.cart_items[0] ? element.cart_items[0].count : 0,
                    measures: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.measure),
                    prices: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.price),
                    paracodes: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.paracode),
                    ids: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.id)
                };
            });
        }

        const uniqueItems = [];
        const seenNames = new Set();
        
        items.forEach(item => {
            if (!seenNames.has(item.name)) {
                seenNames.add(item.name);
                uniqueItems.push(item);
            }
        });

        res.status(result.status).send({
            data: uniqueItems,
        });
    },

}