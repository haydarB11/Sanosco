const { Category, Item } = require('../models');
const httpStatus = require('../utils/httpStatus');
const sequelize = require('sequelize');
const { Op } = sequelize;

class CategoryService {

    constructor(data) {
        this.name = data.name;
        this.name_ar = data.name;
        // this.name_ar = data.name_ar;
        this.image = data.image;
        this.is_show = data.is_show;
        this.category_id = data.category_id;
    }

    async add() {
        try {
            const category = await Category.create(this);
            return {
                data: category,
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
            const category = await Category.findByPk(data.id);
            category.name = data.name || category.name;
            category.name_ar = data.name || category.name;
            // category.name_ar = data.name_ar || category.name_ar;
            category.image = data.image || category.image;
            category.is_show = data.is_show || category.is_show;
            category.category_id = data.category_id || category.category_id;
            await category.save();
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
            const deletedCategory = await Category.destroy({
                where: {
                    id: id
                }
            });
            if (deletedCategory === 1) {
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
            const category = await Category.findAll({
                include: [
                    {
                        model: Category,
                        as: 'categories'
                    }
                ]
            });
            return {
                data: category,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getCount() {
        try {
            const category = await Category.count({});
            return {
                data: category,
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
            const columnName = language === 'ar' ? 'Category.name_ar' : 'Category.name';
            const columnNameForSubCategory = language === 'ar' ? 'name_ar' : 'name';
            const category = await Category.findAll({
                attributes: [
                    'id',
                    // [sequelize.literal(`CASE WHEN language = 'ar' THEN name_ar ELSE name END`), 'name'],
                    [sequelize.col(columnName), 'name'],
                    'is_show',
                    'image',
                    'category_id'
                ],
                include: [
                    {
                        required: true,
                        attributes: [
                            'id',
                            [sequelize.col(columnNameForSubCategory), 'name'],
                            'is_show',
                            'image',
                            // 'category_id'
                        ],
                        model: Category,
                        as: 'categories',
                        where: {
                            is_show: true
                        },
                        include: [
                            {
                                required: true,
                                attributes: [],
                                model: Item,
                                as: 'items',
                                where: {
                                    storage: {
                                        [Op.ne]: 0
                                    },
                                    is_show: true
                                }
                            }
                        ]
                    }
                ],
                where: {
                    is_show: true
                }
            });
            // console.log(category);
            // const categoriesWithNames = category.map(cat => {
            //     const categoryName = language === 'ar' ? cat.name_ar : cat.name;
            //     return {
            //         ...cat.toJSON(),
            //         name: categoryName
            //     };
            // });
            return {
                data: category,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllShowedPrimary(language) {
        try {
            const columnName = language === 'ar' ? 'Category.name_ar' : 'Category.name';
            const category = await Category.findAll({
                attributes: [
                    'id',
                    [sequelize.col(columnName), 'name'],
                    'image'
                ],
                include: [
                    {
                        required: true,
                        attributes: [],
                        model: Category,
                        as: 'categories',
                        where: {
                            is_show: true,
                        },
                        include: [
                            {
                                required: true,
                                attributes: [],
                                model: Item,
                                as: 'items',
                                where: {
                                    storage: {
                                        [Op.ne]: 0,
                                    },
                                    is_show: true
                                }
                            }
                        ]
                    }
                ],
                where: {
                    is_show: true,
                    category_id: {
                        [Op.eq]: null
                    }
                }
            });
            return {
                data: category,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllShowedSecondary(language = 'ar', category_id) {
        try {
            const columnName = language === 'ar' ? 'Category.name_ar' : 'Category.name';
            const category = await Category.findAll({
                attributes: [
                    'id',
                    [sequelize.col(columnName), 'name'],
                    'image'
                ],
                include: [
                    {
                        required: true,
                        attributes: [],
                        model: Item,
                        as: 'items',
                        where: {
                            storage: {
                                [Op.ne]: 0,
                            },
                            is_show: true
                        }
                    }
                ],
                where: {
                    is_show: true,
                    category_id:  category_id
                }
            });
            return {
                data: category,
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

module.exports = { CategoryService };