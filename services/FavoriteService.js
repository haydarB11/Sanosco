const { 
    Favorite,
    User,
    Item,
    sequelize
} = require('../models');
const httpStatus = require('../utils/httpStatus');
const { Op } = require('sequelize');

class FavoriteService {

    constructor(data) {
        this.item_id = data.item_id;
        this.user_id = data.user_id;
    }

    async add() {
        try {
            const favorite = await Favorite.create(this);
            return {
                data: favorite,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async addMany(data) {
        try {
            const favorite = await Favorite.bulkCreate(data);
            return {
                data: favorite,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getForItemForOneUser(data) {
        try {
            const favorite = await Favorite.findOne({
                where: {
                    user_id: data.user_id,
                    item_id: data.item_id
                }
            });
            return {
                data: favorite,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async delete(data) {
        try {
            const deletedFavorite = await Favorite.destroy({
                where: {
                    user_id: data.user_id,
                    item_id: data.item_id
                }
            });
            if (deletedFavorite > 0) {
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

}

module.exports = { FavoriteService };