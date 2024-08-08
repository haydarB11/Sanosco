const { OfferService } = require('../../services/OfferService');
// const { ItemService } = require('../../services/ItemService');
const { UserService } = require('../../services/UserService');
const sendNotificationsMulticast = require('../../utils/notification/notification')


module.exports = {

    addOffer: async (req, res) => {
        const data = req.body;
        const users = await UserService.getTokenFromDataBase();
        if (users.length > 0) {
            const tokens = UserService.splitTokens(users, 500);
            const title = ""
            tokens.forEach((item) => {
                sendNotificationsMulticast(item, title, text)
            })
        }
        const result = await new OfferService(data).add();
        res.status(result.status).send({
            data: result.data,
        });
    },

    deleteOffer: async (req, res) => {
        const result = await OfferService.delete(req.body.ids);
        res.status(result.status).send({
            data: result.data,
        });
    },

    deleteOneOffer: async (req, res) => {
        const result = await OfferService.delete([req.params.offer_id]);
        res.status(result.status).send({
            data: result.data,
        });
    },

    editOffer: async (req, res) => {
        const data = req.body;
        data.id = req.params.offer_id;
        const result = await OfferService.edit(data);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllOffers: async (req, res) => {
        const result = await OfferService.getAll();
        res.status(result.status).send({
            data: result.data,
        });
    },

}