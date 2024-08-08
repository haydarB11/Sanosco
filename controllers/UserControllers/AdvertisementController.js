const { AdvertisementService } = require('../../services/AdvertisementService');
const { ItemService } = require('../../services/ItemService');


module.exports = {

    getAllAdvertisements: async (req, res) => {
        const result = await AdvertisementService.getAllForOneLanguage(req.query.language, req?.user?.id);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAdvertisementById: async (req, res) => {
        const result = await AdvertisementService.getByIdForOneLanguage(req.params.advertisement_id, req.query.language);
        const item = await ItemService.getByIdForUser(req.query.language, result.data.item_id);
        res.status(result.status).send({
            data: result.data,
        });
    },

}