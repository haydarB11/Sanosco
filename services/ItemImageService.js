const { ItemImage } = require('../models');
const httpStatus = require('../utils/httpStatus');
const { Op } = require('sequelize');

class ItemImageService {

    constructor(data) {
        this.image = data.image;
        this.item_id = data.item_id;
        this.is_primary = data.is_primary;
    }

    async add() {
        try {
            const item = await ItemImage.create(this);
            return {
                data: item,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async addMany(data, options) {
        try {
            const itemImages = await ItemImage.bulkCreate(data, options);
            return {
                data: itemImages,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async edit(image_id) {
        try {
            const itemImage = await ItemImage.findByPk(image_id);
            itemImage.is_primary = true;
            await itemImage.save();
            return {
                data: 'edit successfully',
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async editForOneItemToPrimaryFalse(item_id) {
        try {
            const itemImage = await ItemImage.update(
                {is_primary: false}, 
                {where: { item_id: item_id }}
            );
            return {
                data: 'edit successfully',
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllForOneItem(item_id) {
        try {
            const itemImages = await ItemImage.findAll({
                where: {
                    item_id: item_id
                }
            });
            return {
                data: itemImages,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllWithNoItem() {
        try {
            const itemImages = await ItemImage.findAll({
                where: {
                    item_id: {
                        [Op.eq]: null
                    }
                }
            });
            return {
                data: itemImages,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getItemDependingOnImageId(id) {
        try {
            const itemImage = await ItemImage.findOne({
                where: {
                    id: id
                }
            });
            return {
                data: itemImage,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getFirstForOneItem(item_id) {
        try {
            const itemImages = await ItemImage.findOne({
                where: {
                    item_id: item_id
                }
            });
            return {
                data: itemImages,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async delete(id) {
        try {
            const itemImage = await ItemImage.destroy({
                where: {
                    id: id
                }
            });
            if (itemImage === 1) {
                return {
                    data: 'deleted successfully',
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

    static async deleteMany(ids) {
        try {
            // console.log('ok');
            const itemImage = await ItemImage.destroy({
                where: {
                    id: {
                        [Op.in]: ids
                    }
                }
            });
            if (itemImage > 0) {
                return {
                    data: 'deleted successfully',
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

module.exports = { ItemImageService };