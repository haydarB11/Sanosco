const { 
    Offer,
    Item,
    User,
    ItemImage,
    sequelize
} = require('../models');
const httpStatus = require('../utils/httpStatus');
const { Op } = require('sequelize');

class OfferService {

    constructor(data) {
        this.discount = data.discount;
        this.starting_date = data.starting_date;
        this.ending_date = data.ending_date;
        this.item_id = data.item_id;
    }

    async add() {
        try {
            const offer = await Offer.create(this);
            return {
                data: offer,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async edit(data) {
        try {
            const offer = await Offer.findByPk(data.id);
            offer.discount = data.discount || offer.discount;
            offer.starting_date = data.starting_date || offer.starting_date;
            offer.ending_date = data.ending_date || offer.ending_date;
            offer.item_id = data.item_id || offer.item_id;
            await offer.save();
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

    static async delete(ids) {
        try {
            const deletedOffers = await Offer.destroy({
                where: {
                    id: {
                        [Op.in]: ids
                    }
                }
            });
            if (deletedOffers > 0) {
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

    static async getAll() {
        try {
            const offers = await Offer.findAll({
                include: [
                    {
                        model: Item,
                        as: 'item',
                        include: [
                            {
                                model: ItemImage,
                                as: 'item_images'
                            }
                        ]
                    }
                ]
            });
            return {
                data: offers,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllForOneLanguage(language) {
        try {
            const itemName = language === 'ar' ? 'name_ar' : 'name';
            const description = language === 'ar' ? 'description_ar' : 'description';
            const offers = await Offer.findAll({
                attributes: [
                    'id',
                    'discount'
                ],
                include: [
                    {
                        attributes: [
                            'id',
                            'price',
                            'color',
                            'measure',
                            [sequelize.col(itemName), 'name'],
                            [sequelize.col(description), 'description'],
                        ],
                        model: Item,
                        as: 'item',
                        include: [
                            {
                                model: ItemImage,
                                as: 'item_images'
                            }
                        ]
                    }
                ],
            });
            return {
                data: offers,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getByIdForOneLanguage(advertisement_id, language) {
        try {
            const name = language === 'ar' ? 'Advertisement.name_ar' : 'Advertisement.name';
            const title = language === 'ar' ? 'Advertisement.title_ar' : 'Advertisement.title';
            const content = language === 'ar' ? 'Advertisement.content_ar' : 'Advertisement.content';
            // const itemName = language === 'ar' ? 'name_ar' : 'name';
            // const description = language === 'ar' ? 'Item.description_ar' : 'Item.description';
            const advertisements = await Offer.findOne({
                attributes: [
                    'id',
                    [sequelize.col(name), 'name'],
                    [sequelize.col(title), 'title'],
                    [sequelize.col(content), 'content'],
                    'image',
                    'item_id'
                ],
                where: {
                    is_show: true,
                    id: advertisement_id
                }
            });
            return {
                data: advertisements,
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
            const advertisements = await Offer.findOne({
                where: {
                    id: id
                }
            });
            return {
                data: advertisements,
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

module.exports = { OfferService };