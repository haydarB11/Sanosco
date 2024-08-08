const { OTP } = require('../models');
const httpStatus = require('../utils/httpStatus');
// const sequelize = require('sequelize');

class OtpService {

    constructor(data) {
        this.code = data.code;
        this.phone = data.phone;
    }

    async add() {
        try {
            const otp = await OTP.create(this);
            return {
                data: otp,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    // static async edit(data) {
    //     try {
    //         const otp = await OTP.findByPk(data.id);
    //         otp.user_id = data.user_id || otp.user_id;
    //         await otp.save();
    //         return {
    //             data: 'updated',
    //             status: httpStatus.OK
    //         };
    //     } catch (error) {
    //         return {
    //             data: error.message,
    //             status: httpStatus.BAD_REQUEST
    //         };
    //     }
    // }

    static async deleteAllForOneUser(user_id) {
        try {
            const deletedOtp = await OTP.destroy({
                where: {
                    user_id: user_id
                }
            });
            if (deletedOtp >= 1) {
                return {
                    data: 'deleted',
                    status: httpStatus.OK
                };
            } else {
                return {
                    data: 'something went wrong',
                    status: httpStatus.BAD_REQUEST
                };
            }
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getLast(phone) {
        try {
            const otp = await OTP.findOne({
                where: {
                    phone: phone
                },
                limit: 1,
                order: [['id', 'DESC']]
            });
            return {
                data: otp,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

}

module.exports = { OtpService };