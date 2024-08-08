const { 
    Advertisement,
    User,
    Item,
    Category,
    Brand,
    ItemImage,
    Collection,
    Favorite,
    CartItem,
    Cart,
    sequelize
} = require('../models');
const httpStatus = require('../utils/httpStatus');
const { Op } = require('sequelize');

class AdvertisementService {

    constructor(data) {
        this.name = data.name;
        this.name_ar = data.name_ar;
        this.title = data.title;
        this.title_ar = data.title_ar;
        this.image = data.image;
        this.content = data.content;
        this.content_ar = data.content_ar;
        this.is_show = data.is_show;
        this.item_id = data.item_id;
        this.manager_id = data.manager_id;
    }

    async add() {
        try {
            const advertisement = await Advertisement.create(this);
            return {
                data: advertisement,
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
            const advertisement = await Advertisement.findByPk(data.id);
            advertisement.title = data.title || advertisement.title;
            advertisement.title_ar = data.title_ar || advertisement.title_ar;
            advertisement.name = data.name || advertisement.name;
            advertisement.name_ar = data.name_ar || advertisement.name_ar;
            advertisement.content = data.content || advertisement.content;
            advertisement.content_ar = data.content_ar || advertisement.content_ar;
            advertisement.image = data.image || advertisement.image;
            advertisement.item_id = data.item_id || advertisement.item_id;
            if (data.is_show == true || data.is_show == false) { 
                advertisement.is_show = data.is_show;
            }
            await advertisement.save();
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
            const deletedAdvertisement = await Advertisement.destroy({
                where: {
                    id: {
                        [Op.in]: ids
                    }
                }
            });
            if (deletedAdvertisement > 0) {
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
            const advertisements = await Advertisement.findAll({
                include: [
                    // {
                    //     model: User,
                    //     as: 'manager'
                    // },
                    {
                        model: Item,
                        as: 'item'
                    }
                ]
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

    static async getAllForOneLanguage(language, user_id = null) {
        try {
            const name = language === 'ar' ? 'Advertisement.name_ar' : 'Advertisement.name';
            const title = language === 'ar' ? 'Advertisement.title_ar' : 'Advertisement.title';
            const content = language === 'ar' ? 'Advertisement.content_ar' : 'Advertisement.content';
            const itemName = language === 'ar' ? 'name_ar' : 'name';
            const categoryName = language === 'ar' ? 'name_ar' : 'name';
            const collectionName = language === 'ar' ? 'name_ar' : 'name';
            const brandName = language === 'ar' ? 'name_ar' : 'name';
            const description = language === 'ar' ? 'description_ar' : 'description';
            // const itemName = language === 'ar' ? 'name_ar' : 'name';
            // const description = language === 'ar' ? 'Item.description_ar' : 'Item.description';
            const advertisements = await Advertisement.findAll({
                attributes: [
                    'id',
                    [sequelize.col(name), 'name'],
                    [sequelize.col(title), 'title'],
                    [sequelize.col(content), 'content'],
                    'image',
                    'item_id'
                ],
                include: [
                    {
                        model: Item,
                        as: 'item',
                        attributes: [
                            'id',
                            'price',
                            'color',
                            'measure',
                            'paracode',
                            [sequelize.col(itemName), 'name'],
                            [sequelize.col(description), 'description'],
                            'rate'
                            // [
                            //     sequelize.literal(`(
                            //         COALESCE((
                            //         SELECT SUM(r.rate)
                            //         FROM rates r
                            //         WHERE r.item_id = Item.id
                            //         ), 0)
                            //     )`),
                            //     'rate'
                            // ]
                        ],
                        include: [
                            {
                                attributes: [
                                    'id',
                                    'image',
                                    [sequelize.col(categoryName), 'name']
                                ],
                                model: Category,
                                as: 'category',
                                include: [
                                    {
                                        attributes: [
                                            'id',
                                            'image',
                                            [sequelize.col(categoryName), 'name']
                                        ],
                                        model: Category,
                                        as: 'category'
                                    }
                                ]
                            },
                            {
                                attributes: [
                                    'id',
                                    'image',
                                    [sequelize.col(brandName), 'name']
                                ],
                                model: Brand,
                                as: 'brand'
                            },
                            {
                                attributes: [
                                    'id',
                                    'image',
                                    [sequelize.col(collectionName), 'name']
                                ],
                                model: Collection,
                                as: 'collection'
                            },
                            {
                                model: ItemImage,
                                as: 'item_images'
                            },
                            {
                                required: false,
                                model: CartItem,
                                as: 'cart_items',
                                include: [
                                    {
                                        required: true,
                                        model: Cart,
                                        as: 'cart',
                                        where: {
                                            user_id: user_id
                                        }
                                    }
                                ]
                            },
                            {
                                required: false,
                                model: Favorite,
                                as: 'favorite',
                                where: {
                                    user_id: user_id
                                }
                            }
                        ],
                    }
                ],
                where: {
                    is_show: true
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

    static async getByIdForOneLanguage(advertisement_id, language) {
        try {
            const name = language === 'ar' ? 'Advertisement.name_ar' : 'Advertisement.name';
            const title = language === 'ar' ? 'Advertisement.title_ar' : 'Advertisement.title';
            const content = language === 'ar' ? 'Advertisement.content_ar' : 'Advertisement.content';
            // const itemName = language === 'ar' ? 'name_ar' : 'name';
            // const description = language === 'ar' ? 'Item.description_ar' : 'Item.description';
            const advertisements = await Advertisement.findOne({
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
            const advertisements = await Advertisement.findOne({
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

module.exports = { AdvertisementService };