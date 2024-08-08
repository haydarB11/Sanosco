const { NotificationService } = require('../../services/NotificationService');
const { UserService } = require('../../services/UserService');
const httpStatus = require('../../utils/httpStatus');

module.exports = {

    sendNotification: async (req, res) => {
        try {
            const tokens = await UserService.getTokenFromDataBase();
            const splitTokens = await UserService.splitTokens(tokens, 500);
            await NotificationService.store(req.body);
            const result = await NotificationService.send(splitTokens, req.body);
            res.status(result.status).send({
                data: result.data,
            });
        } catch (error) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                error: error.message,
            });
        }
    },

}