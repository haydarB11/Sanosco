const { AdvertisementService } = require('../../services/AdvertisementService');
const { ItemService } = require('../../services/ItemService');
const { NotificationService } = require('../../services/NotificationService');
const { NotificationUserService } = require('../../services/NotificationUserService');
const { UserService } = require('../../services/UserService');
const sendNotificationsMulticast = require('../../utils/notification/notification')


module.exports = {

    addAdvertisement: async (req, res) => {
        const data = req.body;
        data.manager_id = req.user.id;
        if (req.file?.path) {
            data.image = req.file.path;
        } else {
            return res.status(400).send({
                data: 'file is required',
            });
        }
        const users = await UserService.getTokenFromDataBase();
        console.log(users);
        if (users.length > 0) {
            const tokens = await UserService.splitTokens(users, 500);
            console.log(tokens);
            const title = "";
            const text = "";
            tokens.forEach((item) => {
                sendNotificationsMulticast(item, title, text)
            });
            const notification = await NotificationService.store({title: title, body: text});
            // console.log(notification);
            const usersIds = await UserService.getAllUserAndPromoterIds();
            const factoredNotificationUsers = usersIds.data.map((id) => ({
                user_id: id,
                notification_id: notification.data.id
            }));
            const notificationUsers = NotificationUserService.addMany(factoredNotificationUsers);
        }
        const result = await new AdvertisementService(data).add();
        res.status(result.status).send({
            data: result.data,
        });
    },

    deleteAdvertisement: async (req, res) => {
        const result = await AdvertisementService.delete(req.body.ids);
        res.status(result.status).send({
            data: result.data,
        });
    },

    editAdvertisement: async (req, res) => {
        const data = req.body;
        data.id = req.params.advertisement_id;
        data.image = req.file?.path;
        const result = await AdvertisementService.edit(data);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllAdvertisements: async (req, res) => {
        const result = await AdvertisementService.getAll();
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAdvertisementById: async (req, res) => {
        const result = await AdvertisementService.getById(req.params.advertisement_id);
        const item = await ItemService.getById(result.data.item_id);
        res.status(item.status).send({
            data: item.data,
        });
    },

}