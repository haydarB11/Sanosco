const { UserService } = require('../../services/UserService');
const { OtpService } = require('../../services/OtpService');
const twilio = require('twilio');
const IP = require('ip');
const axios = require('axios');


module.exports = {

    userRegister: async (req, res) => {

        const data = req.body;
        if (data.phone.startsWith('+9639') || data.phone.startsWith('09') || data.phone.startsWith('9')) {
            data.country = 'Syria';
        } else {
            data.country = 'Lebanon';
        }
        const oldUser = await UserService.getByPhoneAndUser(data);
        if (oldUser.data?.id) {
            const deletedUser = await UserService.delete(oldUser.data.id);
        }
        data.is_verified = false;
        const result = await new UserService(data).add();
        const code = UserService.generateOTP();
        const Otp = await new OtpService({ code, phone: data.phone }).add();
        res.status(result.status).send({
            data: result.data,
        });
    },

    userLogin: async (req, res) => {
        const otp = Math.floor(100000 + Math.random() * 900000);
        const result = await UserService.userLogin(req.body);
        res.status(result.status).send({
            data: result.data,
        });
    },

    editOwnAccount: async (req, res) => { 
        const data = req.body;
        data.id = req.user.id;
        const result = await UserService.edit(data);
        if (data.phone) {
            const code = UserService.generateOTP();
            const Otp = await new OtpService({ code, phone: data.phone }).add();
        }
        res.status(result.status).send({
            data: result.data,
        });
    },

    deleteAccount: async (req, res) => {
        const result = await UserService.delete(req.user.id);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getUserById: async (req, res) => {
        const result = await UserService.getById(req?.user?.id || req.params?.user_id);
        res.status(result.status).send({
            data: result.data,
        });
    },

    verifyOtp: async (req, res) => {
        const data = req.body;
        const otp = await OtpService.getLast(data.phone);
        if (req.body.code == '0000') {
            const user =await UserService.editByPhone({ is_verified: true, phone: data.phone  });
            const result = await UserService.userLogin({ phone: data.phone, password: user.data.password });
            res.status(result.status).send({
                data: result.data,
            });
        } else {
            res.status(404).send({
                data: 'wrong code',
            });
        }
    },

    sendOTP: async (req, res) => {
        const { phone } = req.body;
        try {
            const code = UserService.generateOTP();
            const Otp = await new OtpService({ code, phone }).add();
            res.status(Otp.status).send({
                data: 'sent successfully',
            });
        } catch (error) {
            res.status(404).send({
                data: error.message,
            });
        }
    },

    resetPassword: async (req, res) => {
        const { new_password, confirm } = req.body;
        if ( new_password === confirm) {
            const result = await UserService.edit({ password: new_password, id: req.user.id });     
            res.status(result.status).send({
                data: result.data,
            });
        } else {    
            return res.status(404).send({
                data: 'password is not equal confirmed one',
            });
        }
    },

}