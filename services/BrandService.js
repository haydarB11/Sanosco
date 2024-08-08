const { Brand, Item, Category } = require('../models');
const httpStatus = require('../utils/httpStatus');
const sequelize = require('sequelize');
const { Op } = sequelize;

class BrandService {

    constructor(data) {
        this.name = data.name;
        this.name_ar = data.name;
        // this.name_ar = data.name_ar;
        this.image = data.image;
        this.is_show = data.is_show;
    }

    async add() {
        try {
            const brand = await Brand.create(this);
            return {
                data: brand,
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
            const brand = await Brand.findByPk(data.id);
            brand.name = data.name || brand.name;
            brand.name_ar = data.name || brand.name;
            // brand.name_ar = data.name_ar || brand.name_ar;
            brand.image = data.image || brand.image;
            brand.is_show = data.is_show || brand.is_show;
            await brand.save();
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

    static async delete(id) {
        try {
            const deletedBrand = await Brand.destroy({
                where: {
                    id: id
                }
            });
            if (deletedBrand === 1) {
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

    static async getCount() {
        try {
            const brands = await Brand.count({});
            return {
                data: brands,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAll() {
        try {
            const brands = await Brand.findAll({});
            return {
                data: brands,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllShowed(language) {
        try {
            const columnName = language === 'ar' ? 'Brand.name_ar' : 'Brand.name';
            const brands = await Brand.findAll({
                attributes: [
                    'id',
                    'image',
                    'is_show',
                    [sequelize.col(columnName), 'name']
                ],
                include: [
                    {
                        attributes: [],
                        model: Item,
                        as: 'items',
                        where: {
                            storage: {
                                [Op.ne]: 0
                            }
                        }
                    }
                ],
                where: {
                    is_show: true
                }
            });
            return {
                data: brands,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllShowedForOneCategory(language, category_id) {
        try {
            const columnName = language === 'ar' ? 'Brand.name_ar' : 'Brand.name';
            const brands = await Brand.findAll({
                attributes: [
                    'id',
                    'image',
                    [sequelize.col(columnName), 'name']
                ],
                include: [
                    {
                        attributes: [],
                        required: true,
                        model: Item,
                        as: 'items',
                        where: {
                            category_id: category_id,
                            storage: {
                                [Op.ne]: 0
                            }
                        }
                    }
                ],
                where: {
                    is_show: true
                }
            });
            return {
                data: brands,
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

module.exports = { BrandService };