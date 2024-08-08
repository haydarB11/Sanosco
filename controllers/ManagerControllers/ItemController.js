const { ItemService } = require('../../services/ItemService');
const { ItemImageService } = require('../../services/ItemImageService');
const { sequelize } = require('../../models');
const { UserService } = require('../../services/UserService');
const sendNotificationsMulticast = require('../../utils/notification/notification')

module.exports = {

    addItemWithItsImages: async (req, res) => {
        const data = req.body;
        data.manager_id = req.user.id;
        const t = await sequelize.transaction();
        try {
            if (data.rate > 5 || data.rate < 0) {
                return res.status(400).send({
                    data: 'rate must be between 0 and 5'
                })
            } else {
                data.rate_number = 1;
            }
            const item = await new ItemService(data).add({ transaction: t });
            item_id = item.data.id;
            const itemImagesData = req.files.map(file => ({
                image: file.path,
                item_id: item_id
            }));
            itemImagesData[0].is_primary = true;
            const itemImages = await ItemImageService.addMany(itemImagesData, { transaction: t });
            const users = await UserService.getTokenFromDataBase();
            if (users.length > 0) {
                const tokens = UserService.splitTokens(users, 500);
                tokens.forEach((item) => {
                    sendNotificationsMulticast(item, title, text)
                })
            }
            res.status(itemImages.status).send({
                data: 'successfully added',
            });
            await t.commit();
        } catch (error) {
            await t.rollback();
            res.status(500).send({
                error: 'An error occurred'
            });
        } 
    },

    editItemWithItsImages: async (req, res) => {
        const data = req.body;
        data.manager_id = req.user.id;
        data.id = req.params.item_id;
        const t = await sequelize.transaction();
        try {       
            const item = await ItemService.edit(data);
            // item_id = item.data.id;
            const itemImagesData = req.files.map(file => ({
                image: file.path,
                item_id: data.id
            }));
            // itemImagesData[0].is_primary = true;
            const oldItemImages = await ItemImageService.getAllForOneItem(data.id);
            if (oldItemImages.data.length == 0) {
                itemImagesData[0].is_primary = true;
            }
            const itemImages = await ItemImageService.addMany(itemImagesData, { transaction: t });
            res.status(itemImages.status).send({
                data: 'successfully added',
            });
            await t.commit();
        } catch (error) {
            await t.rollback();
            res.status(500).send({
                error: 'An error occurred'
            });
        } 
    },

    editItem: async (req, res) => {
        const data = req.body;
        data.id = req.params.item_id;
        const result = await ItemService.edit(data);
        res.status(result.status).send({
            data: result.data,
        });
    },

    deleteItem: async (req, res) => {
        const result = await ItemService.delete(req.params.item_id);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllItems: async (req, res) => {
        const result = await ItemService.getAll(req.query.page, req.query.pageSize);
        res.status(result.status).send({
            data: result.data,
            pagination: result.pagination,
        });
    },

    getAllItemsWithNoStorage: async (req, res) => {
        const result = await ItemService.getAllWithNoStorage(req.query.page, req.query.pageSize);
        res.status(result.status).send({
            data: result.data,
            pagination: result.pagination,
        });
    },

    getAllItemsWithFilter: async (req, res) => {
        const result = await ItemService.getAllFiltered(req.query.title, req.query.page, req.query.pageSize);
        res.status(result.status).send({
            data: result.data,
            pagination: result.pagination,
        });
    },

    getAllItemsWithFilterForBrand: async (req, res) => {
        const result = await ItemService.getAllFilteredForBrand(req.query.title, req.query.page, req.query.pageSize);
        res.status(result.status).send({
            data: result.data,
            pagination: result.pagination,
        });
    },

    getAllItemsWithFilterForCollection: async (req, res) => {
        const result = await ItemService.getAllFilteredForCollection(req.query.title, req.query.page, req.query.pageSize);
        res.status(result.status).send({
            data: result.data,
            pagination: result.pagination,
        });
    },

    getAllItemsWithFilterForPCategory: async (req, res) => {
        const result = await ItemService.getAllFilteredForPCategory(req.query.title, req.query.page, req.query.pageSize);
        res.status(result.status).send({
            data: result.data,
            pagination: result.pagination,
        });
    },

    getAllItemsWithFilterForSCategory: async (req, res) => {
        const result = await ItemService.getAllFilteredForSCategory(req.query.title, req.query.page, req.query.pageSize);
        res.status(result.status).send({
            data: result.data,
            pagination: result.pagination,
        });
    },

    getAllItemsForOneCategory: async (req, res) => {
        const result = await ItemService.getAllForOneCategory(req.params.category_id, req.query.page, req.query.pageSize);
        res.status(result.status).send({
            data: result.data,
            pagination: result.pagination,
        });
    },

    getAllItemsForOneBrand: async (req, res) => {
        const result = await ItemService.getAllForOneBrand(req.params.brand_id, req.query.page, req.query.pageSize);
        res.status(result.status).send({
            data: result.data,
            pagination: result.pagination,
        });
    },

    getAllItemsForOneCollection: async (req, res) => {
        const result = await ItemService.getAllForOneCollection(req.params.collection_id, req.query.page, req.query.pageSize);
        res.status(result.status).send({
            data: result.data,
            pagination: result.pagination,
        });
    },

    getItemById: async (req, res) => {
        const result = await ItemService.getById(req.params.item_id);
        res.status(result.status).send({
            data: result.data,
        });
    },

}