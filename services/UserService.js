const { 
    User,
} = require('../models');
const httpStatus = require('../utils/httpStatus');
const { Op } = require('sequelize');

class UserService {

    constructor(data) {
        // this.first_name = data.first_name;
        // this.last_name = data.last_name;
        this.full_name = data.full_name;
        this.email = data.email;
        this.phone = data.phone;
        this.password = data.password;
        this.type = data.type;
        this.country = data.country;
        this.address = data.address;
        this.token = data.token;
        this.is_activated = data.is_activated;
        this.is_verified = data.is_verified;
    }

    async add() {
        try {
            const user = await User.create(this);
            return {
                data: user,
                status: httpStatus.OK
            };
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                // console.log(error.errors);
                return {
                    data: error.errors[0].message,
                    // data: error.errors.map((err) => {
                    //     return {
                    //         name: err.path,
                    //         message: err.message
                    //     }
                    // }),
                    status: httpStatus.BAD_REQUEST
                }
            } else {
                return {
                    data: error,
                    status: httpStatus.BAD_REQUEST
                };
            }
        }
    }

    static async getAll() {
        try {
            const user = await User.findAll({
                where: {
                    is_verified: true
                }
            });
            return {
                data: user,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllUserAndPromoterIds() {
        try {
            const users = await User.findAll({
                where: {
                    is_verified: true,
                    type: {
                        [Op.ne]: 'manager'
                    }
                }
            });
            const ids = users.map((user) => user.id)
            return {
                data: ids,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getById(id) {
        try {
            const user = await User.findByPk(id);
            return {
                data: user,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getByPhoneAndUser(data) {
        try {
            const user = await User.findOne({
                where: {
                    [Op.or]: [
                        {
                            email: data.email,
                        },
                        {
                            phone: data.phone,
                        },
                    ],
                    is_verified: false
                }
            });
            return {
                data: user,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async managerLogin(data) {
        try {
            const user = await User.findOne({
                where: {
                    email: data.email,
                }
            });
            if (!user || user.type === "user") {
                return {
                    data: 'Email Not Found',
                    status: httpStatus.NOT_FOUND
                };
            } else if (data.password !== user.password) {
                return {
                    data: 'Invalid password',
                    status: httpStatus.NOT_FOUND
                };
            } else {
                return {
                    data: {
                        token: user.generateToken(),
                        data: user
                    },
                    status: httpStatus.OK
                };
            }
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async userLogin(data) {
        try {
            const user = await User.findOne({
                where: {
                    phone: data.phone,
                }
            });
            if (!user || user?.type === "manager" || user?.type === "supervisor") {
                return {
                    data: 'phone Not Found',
                    status: httpStatus.NOT_FOUND
                };
            } else if (data.password !== user.password) {
                return {
                    data: 'Invalid password',
                    status: httpStatus.NOT_FOUND
                }
            } else if (user.is_verified == false) {
                return {
                    data: 'verify the user first',
                    status: httpStatus.BAD_REQUEST
                }
            } else {
                // user.mac_address = data.mac_address;
                // user.save();
                // user.loggedIn = true;
                // await user.save();
                return {
                    data: {
                        token: user.generateToken(),
                        data: user
                    },
                    status: httpStatus.OK
                }
            }
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async edit(data) {
        try {
            const user = await User.findByPk(+data.id);
            // user.first_name = data.first_name || user.first_name;
            // user.last_name = data.last_name || user.last_name;
            user.full_name = data.full_name || user.full_name;
            user.email = data.email || user.email;
            user.phone = data.phone || user.phone;
            user.password = data.password || user.password;
            user.country = data.country || user.country;
            user.address = data.address || user.address;
            user.language = data.language || user.language;
            user.token = data.token || user.token;
            user.type = data.type || user.type;
            if (data.is_activated == true || data.is_activated == false) { 
                user.is_activated = data.is_activated;
            }
            if (!data.full_name && !data.email && !data.phone && !data.password && !data.country && !data.address && !data.language && !data.is_activated && !data.type) {
                user.token = null;
            }
            await user.save();
            return {
                data: 'updated',
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async editByPhone(data) {
        try {
            const user = await User.findOne({
                where: {
                    phone: data.phone
                }
            });
            // user.first_name = data.first_name || user.first_name;
            // user.last_name = data.last_name || user.last_name;
            user.full_name = data.full_name || user.full_name;
            user.email = data.email || user.email;
            user.phone = data.phone || user.phone;
            user.password = data.password || user.password;
            user.country = data.country || user.country;
            user.address = data.address || user.address;
            user.language = data.language || user.language;
            user.token = data.token || user.token;
            if (data.is_activated == true || data.is_activated == false) { 
                user.is_activated = data.is_activated;
            }
            if (data.is_verified == true || data.is_verified == false) { 
                user.is_verified = data.is_verified;
            }
            await user.save();
            return {
                data: user,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async delete(user_id) {
    try {
            const user = await User.destroy({
                where: {
                    id: user_id
                }
            });
            if (user == 1) {
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

    static async getTokenFromDataBase() {
        try {
            let tokens = await User.findAll({
                attributes: ['token'],
                where: {
                    token: {
                        [Op.not]: null
                    }
                }
            });
            // if (!tokens || tokens.length === 0) {
            //     throw new Error('No tokens found in the database.');
            // }
            tokens = tokens.map(item => item.token);
            return tokens;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async getTokenForOneUser(user_id) {
        try {
            let tokens = await User.findAll({
                attributes: ['token'],
                where: {
                    token: {
                        [Op.not]: null
                    },
                    id: user_id
                }
            });
            // if (!tokens || tokens.length === 0) {
            //     throw new Error('No tokens found in the database.');
            // }
            tokens = tokens.map(item => item.token);
            return tokens;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async splitTokens(tokens, chunkSize) {
            const chunks = [];
            let i = 0;
            while (i < tokens.length) {
                chunks.push(tokens.slice(i, (i += chunkSize)));
            }
            return chunks;
    }

    static generateOTP() {
        let digits = '0123456789'; 
        let OTP = ''; 
        let len = digits.length 
        for (let i = 0; i < 4; i++) { 
            OTP += digits[Math.floor(Math.random() * len)]; 
        } 
        return OTP; 
    } 

}

module.exports = { UserService };