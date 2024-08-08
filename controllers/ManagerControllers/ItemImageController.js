const { ItemService } = require('../../services/ItemService');
const { ItemImageService } = require('../../services/ItemImageService');
const { sequelize } = require('../../models');

module.exports = {

    addItemImages: async (req, res) => {
        const itemImagesData = req.files.map(file => ({
            image: file.path,
            item_id: req.params.item_id,
        }));
        const itemImages = await ItemImageService.addMany(itemImagesData);
        res.status(itemImages.status).send({
            data: 'successfully added',
        });
    },

    deleteManyItemImage: async (req, res) => {
        try {
            const item = await ItemImageService.getItemDependingOnImageId(req.body.ids[0]);
            const result = await ItemImageService.deleteMany(req.body.ids);
            if (item.data?.id) {
                const item_id = item.data.item_id;
                const itemImage = await ItemImageService.getFirstForOneItem(item_id);
                const newItemImage = await ItemImageService.edit(itemImage.data.id);
            }
            res.status(result.status).send({
                data: result.data,
            });
        } catch (err) {
            res.status(503).send({
                data: err.message,
            });
        }
    },

    editItemImage: async (req, res) => {
        const editImages = await ItemImageService.editForOneItemToPrimaryFalse(req.body.item_id);
        const result = await ItemImageService.edit(req.body.image_id);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllItemImagesWithNoItem: async (req, res) => {
        const result = await ItemImageService.getAllWithNoItem();
        res.status(result.status).send({
            data: result.data,
        });
    },

}