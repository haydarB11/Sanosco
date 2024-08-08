const { User, Sequelize, Notification, NotificationUser } = require('../models');
const httpStatus = require('../utils/httpStatus');
const sendNotifications = require('../utils/notification/notification');

class NotificationService {

    static async send(splitTokens, data) {
        try {
            const messagesPromises = splitTokens.map( async (tokens) => {
                return sendNotifications(tokens, data.title, data.body);
            });
            const response = await Promise.all(messagesPromises);
            return {
                data: "Successfully sent message",
                status: httpStatus.OK
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async get() {
        try {
            const notifications = await Notification.findAll({
                order: [["id", 'DESC']]
            });
            return {
                data: notifications,
                status: httpStatus.OK
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async getAllForOneLanguage(language = 'ar', user_id) {
        try {
            const notifications = await Notification.findAll({
                // attributes: [
                //     'id',
                //     [`title_${language}`, 'title'],
                //     [`content_${language}`, 'content'],
                // ],
                include: [
                    {
                        // attributes: [
                        //     'is_read'
                        // ],
                        required: true,
                        model: NotificationUser,
                        as: 'notification_users',
                        where: {
                            user_id: user_id
                        }
                    }
                ],
                raw: true,
                order: [["id", 'DESC']]
            });
            return {
                data: notifications,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async store(data) {
        try {
            // console.log(data);
            const notification = await Notification.create({
                body: data.body,
                title: data.title
            });
            return {
                data: notification,
                status: httpStatus.OK
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

}

module.exports = { NotificationService };