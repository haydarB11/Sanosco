const { UserService } = require('../../services/UserService');


module.exports = {

    addUser: async (req, res) => {
        const data = req.body;
        data.is_verified = true;
        const result = await new UserService(data).add();
        res.status(result.status).send({
            data: result.data,
        });
    },

    managerLogin: async (req, res) => {
        const result = await UserService.managerLogin(req.body);
        res.status(result.status).send({
            data: result.data,
        });
    },

    editUser: async (req, res) => {
        const data = req.body;
        data.id = req.params.user_id;
        const result = await UserService.edit(data);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getMyOwnAccount: async (req, res) => {
        const result = await UserService.getById(req.user.id);
        res.status(result.status).send({
            data: result.data,
        });
    },

    deleteUser: async (req, res) => {
        const result = await UserService.delete(req.params.user_id);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllUsers: async (req, res) => {
        const result = await UserService.getAll();
        // const pp = await UserService.sendSMS();
        res.status(result.status).send({
            data: result.data,
        });
    },

    editOwnAccount: async (req, res) => {
        const data = req.body;
        data.id = req.user.id;
        const result = await UserService.edit(data);
        res.status(result.status).send({
            data: result.data,
        });
    },

}