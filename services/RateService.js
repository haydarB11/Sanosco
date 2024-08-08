const { 
    Rate,
} = require('../models');
const httpStatus = require('../utils/httpStatus');

class RateService {

    constructor(data) {
        this.rate = data.rate;
        this.user_id = data.user_id;
        this.item_id = data.item_id;
    }

    async add() {
        try {
            const rate = await Rate.create(this);
            return {
                data: rate,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async    getForOneItemForOneUser(data) {
        try {
            const rate = await Rate.findOne({
                where: {
                    user_id: data.user_id,
                    item_id: data.item_id,
                }
            });
            return {
                data: rate,
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

module.exports = { RateService };