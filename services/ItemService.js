const { 
    Item, 
    Category, 
    Brand,
    Collection, 
    ItemImage,
    User,
    OrderItem,
    Order,
    Rate,
    Offer,
    Cart,
    CartItem,
    Favorite,
    sequelize
} = require('../models');
const httpStatus = require('../utils/httpStatus');
const { Op } = require('sequelize');
// const sequelize = require('sequelize');
// const { Op } = sequelize;

class ItemService {

    constructor(data) {
        this.name = data.name;
        this.name_ar = data.name;
        // this.name_ar = data.name_ar;
        this.description = data.description;
        this.description_ar = data.description;
        // this.description_ar = data.description_ar;
        this.storage = data.storage;
        this.price = data.price;
        this.measure = data.measure;
        // this.unit = data.unit;
        this.color = data.color;
        this.is_show = data.is_show;
        this.category_id = data.category_id;
        this.brand_id = data.brand_id;
        this.collection_id = data.collection_id;
        this.manager_id = data.manager_id;
        this.paracode = data.paracode;
        this.rate = data.rate;
        this.rate_number = data.rate_number;
    }

    async add(options) {
        try {
            const item = await Item.create(this, options);
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

    static async edit(data) {
        try {
            const item = await Item.findByPk(data.id);
            item.name = data.name || item.name;
            item.name_ar = data.name || item.name;
            // item.name_ar = data.name_ar || item.name_ar;
            item.description = data.description || item.description;
            item.description_ar = data.description || item.description;
            // item.description_ar = data.description_ar || item.description_ar;
            item.storage = data.storage || item.storage;
            item.price = data.price || item.price;
            item.measure = data.measure || item.measure;
            item.color = data.color || item.color;
            item.is_show = data.is_show || item.is_show;
            item.category_id = data.category_id || item.category_id;
            item.brand_id = data.brand_id || item.brand_id;
            item.paracode = data.paracode || item.paracode;
            item.collection_id = data.collection_id || item.collection_id;
            await item.save();
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

    static async editRate(data) {
        try {
            const item = await Item.findByPk(data.item_id);
            item.rate = (data.rate + item.rate * item.rate_number) / (item.rate_number + 1);
            item.rate_number += 1;
            await item.save();
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

    static async decreaseStorage(data, option) {
        try {
            const item = await Item.findByPk(data.id);
            if (item.storage >= data.decrease) {
                item.storage = item.storage - data.decrease;
                await item.save(option);
            } else {
                return {
                    data: 'Insufficient Storage',
                    status: httpStatus.BAD_REQUEST
                };
            }
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

    static async delete(id) {
        try {
            const item = await Item.destroy({
                where: {
                    id: id
                }
            });
            if (item === 1) {
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
    
    static async getManyItems(ids) {
        try {
            const today = new Date();
            let items = await Item.findAll({
                include: [
                    {
                        model: Offer,
                        as: 'offers',
                        order: [['id', 'DESC']],
                        limit: 1,
                        where: {
                            starting_date: {
                                [Op.lte]: today
                            },
                            ending_date: {
                                [Op.gte]: today
                            }
                        }                    
                    }
                ],
                where: {
                    id: {
                        [Op.in]: ids
                    }
                }
            });
            return {
                data: items,
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
            const items = await Item.count({});
            return {
                data: items,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAll(page = 1, pageSize = 10) {
        try {
            const offset = (page - 1) * pageSize;
            const items = await Item.findAll({
                include: [
                    {
                        model: Category,
                        as: 'category',
                        include: [
                            {
                                model: Category,
                                as: 'category'
                            }
                        ]
                    },
                    {
                        model: Brand,
                        as: 'brand'
                    },
                    {
                        model: Collection,
                        as: 'collection'
                    },
                    {
                        model: ItemImage,
                        as: 'item_images',
                        order: [['id']]
                    },
                    // {
                    //     model: User,
                    //     as: 'manager'
                    // }
                ],
                limit: +pageSize,
                offset,
                order: [['id', 'DESC']],
            });
            
            const totalItems = await Item.count();
        
            return {
                data: items,
                status: httpStatus.OK,
                pagination: {
                    totalItems,
                    totalPages: Math.ceil(totalItems / pageSize),
                    currentPage: page,
                    pageSize,
                },
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST,
            };
        }
    }

    static async getAllWithNoStorage(page = 1, pageSize = 10) {
        try {
            const offset = (page - 1) * pageSize;
            const items = await Item.findAll({
                include: [
                    {
                        model: Category,
                        as: 'category',
                        include: [
                            {
                                model: Category,
                                as: 'category'
                            }
                        ]
                    },
                    {
                        model: Brand,
                        as: 'brand'
                    },
                    {
                        model: Collection,
                        as: 'collection'
                    },
                    {
                        model: ItemImage,
                        as: 'item_images',
                        order: [['id']]
                    },
                    // {
                    //     model: User,
                    //     as: 'manager'
                    // }
                ],
                where: {
                    storage: 0
                },
                limit: +pageSize,
                offset,
                order: [['id', 'DESC']],
            });
            
            const totalItems = await Item.count({
                where: {
                    storage: 0
                }
            });
        
            return {
                data: items,
                status: httpStatus.OK,
                pagination: {
                    totalItems,
                    totalPages: Math.ceil(totalItems / pageSize),
                    currentPage: page,
                    pageSize,
                },
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST,
            };
        }
    }

    static async getAllFiltered(title, page = 1, pageSize = 10) {
        try {
            const offset = (page - 1) * pageSize;
            const items = await Item.findAll({
                include: [
                    {
                        model: Category,
                        as: 'category',
                        include: [
                            {
                                model: Category,
                                as: 'category'
                            }
                        ]
                    },
                    {
                        model: Brand,
                        as: 'brand'
                    },
                    {
                        model: Collection,
                        as: 'collection'
                    },
                    {
                        model: ItemImage,
                        as: 'item_images',
                        order: [['id']]
                    },
                    // {
                    //     model: User,
                    //     as: 'manager'
                    // }
                ],
                where: {
                    name: {
                        [Op.like]: `%${title}%`
                    }
                },
                // where: {
                //     [Op.or]: [
                //         // {
                //         //     '$Category.name$': {
                //         //         [Op.like]: `%${title}%`
                //         //     }
                //         // },
                //         {
                //             '$brand.name$': {
                //                 [Op.like]: `%${title}%`
                //             }
                //         },
                //         {
                //             '$collection.name$': {
                //                 [Op.like]: `%${title}%`
                //             }
                //         },
                //         {
                //             '$item.name$': {
                //                 [Op.like]: `%${title}%`
                //             }
                //         }
                //     ]
                // },
                limit: +pageSize,
                offset,
                order: [['id', 'DESC']],
            });
            
            const totalItems = await Item.count({
                where: {
                    name: {
                        [Op.like]: `%${title}%`
                    }
                }
            });
        
            return {
                data: items,
                status: httpStatus.OK,
                pagination: {
                    totalItems,
                    totalPages: Math.ceil(totalItems / pageSize),
                    currentPage: page,
                    pageSize,
                },
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST,
            };
        }
    }

    static async getAllFilteredForBrand(title, page = 1, pageSize = 10) {
        try {
            const offset = (page - 1) * pageSize;
            const items = await Item.findAll({
                include: [
                    {
                        model: Category,
                        as: 'category',
                        include: [
                            {
                                model: Category,
                                as: 'category'
                            }
                        ]
                    },
                    {
                        required: true,
                        model: Brand,
                        as: 'brand',
                        where: {
                            name: {
                                [Op.like]: `%${title}%`
                            }
                        },
                    },
                    {
                        model: Collection,
                        as: 'collection'
                    },
                    {
                        model: ItemImage,
                        as: 'item_images',
                        order: [['id']]
                    },
                    // {
                    //     model: User,
                    //     as: 'manager'
                    // }
                ],
                limit: +pageSize,
                offset,
                order: [['id', 'DESC']],
            });
            
            const totalItems = await Item.count({
                include: [
                    {
                        model: Brand,
                        as: 'brand',
                        where: {
                            name: {
                                [Op.like]: `%${title}%`,
                            }
                        }
                    }
                ]
            });
        
            return {
                data: items,
                status: httpStatus.OK,
                pagination: {
                    totalItems,
                    totalPages: Math.ceil(totalItems / pageSize),
                    currentPage: page,
                    pageSize,
                },
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST,
            };
        }
    }

    static async getAllFilteredForCollection(title, page = 1, pageSize = 10) {
        try {
            const offset = (page - 1) * pageSize;
            const items = await Item.findAll({
                include: [
                    {
                        model: Category,
                        as: 'category',
                        include: [
                            {
                                model: Category,
                                as: 'category'
                            }
                        ]
                    },
                    {
                        required: true,
                        model: Brand,
                        as: 'brand',
                    },
                    {
                        model: Collection,
                        as: 'collection',
                        where: {
                            name: {
                                [Op.like]: `%${title}%`
                            }
                        },
                    },
                    {
                        model: ItemImage,
                        as: 'item_images',
                        order: [['id']]
                    },
                    // {
                    //     model: User,
                    //     as: 'manager'
                    // }
                ],
                limit: +pageSize,
                offset,
                order: [['id', 'DESC']],
            });
            
            const totalItems = await Item.count({
                include: [
                    {
                        model: Collection,
                        as: 'collection',
                        where: {
                            name: {
                                [Op.like]: `%${title}%`,
                            }
                        }
                    }
                ]
            });
        
            return {
                data: items,
                status: httpStatus.OK,
                pagination: {
                    totalItems,
                    totalPages: Math.ceil(totalItems / pageSize),
                    currentPage: page,
                    pageSize,
                },
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST,
            };
        }
    }

    static async getAllFilteredForPCategory(title, page = 1, pageSize = 10) {
        try {
            const offset = (page - 1) * pageSize;
            const items = await Item.findAll({
                include: [
                    {
                        required: true,
                        model: Category,
                        as: 'category',
                        where: {
                            'name': {
                                [Op.like]: `%${title}%`
                            }
                        },
                        include: [
                            {
                                model: Category,
                                as: 'category'
                            }
                        ]
                    },
                    {
                        required: true,
                        model: Brand,
                        as: 'brand',
                    },
                    {
                        model: Collection,
                        as: 'collection',
                    },
                    {
                        model: ItemImage,
                        as: 'item_images',
                        order: [['id']]
                    },
                    // {
                    //     model: User,
                    //     as: 'manager'
                    // }
                ],
                // where: {
                //     'category.category.name': {
                //         [Op.like]: `%${title}%`
                //     }
                // },
                limit: +pageSize,
                offset,
                order: [['id', 'DESC']],
            });
            
            const totalItems = await Item.count({
                include: [
                    {
                        required: true,
                        model: Category,
                        as: 'category',
                        where: {
                            name: {
                                [Op.like]: `%${title}%`,
                            }
                        }
                    }
                ]
            });
        
            return {
                data: items,
                status: httpStatus.OK,
                pagination: {
                    totalItems,
                    totalPages: Math.ceil(totalItems / pageSize),
                    currentPage: page,
                    pageSize,
                },
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST,
            };
        }
    }

    static async getAllFilteredForSCategory(title, page = 1, pageSize = 10) {
        try {
            const offset = (page - 1) * pageSize;
            const items = await Item.findAll({
                include: [
                    {
                        required: true,
                        model: Category,
                        as: 'category',
                        include: [
                            {
                                required: true,
                                model: Category,
                                as: 'category',
                                where: {
                                    'name': {
                                        [Op.like]: `%${title}%`
                                    }
                                },
                            }
                        ]
                    },
                    {
                        required: true,
                        model: Brand,
                        as: 'brand',
                    },
                    {
                        model: Collection,
                        as: 'collection',
                    },
                    {
                        model: ItemImage,
                        as: 'item_images',
                        order: [['id']]
                    },
                    // {
                    //     model: User,
                    //     as: 'manager'
                    // }
                ],
                // where: {
                //     'category.category.name': {
                //         [Op.like]: `%${title}%`
                //     }
                // },
                limit: +pageSize,
                offset,
                order: [['id', 'DESC']],
            });
            
            const totalItems = await Item.count({
                include: [
                    {
                        required: true,
                        model: Category,
                        as: 'category',
                        include: [
                            {
                                model: Category,
                                as: 'category',
                                where: {
                                    name: {
                                        [Op.like]: `%${title}%`,
                                    }
                                }
                            }
                        ]
                    }
                ]
            });
        
            return {
                data: items,
                status: httpStatus.OK,
                pagination: {
                    totalItems,
                    totalPages: Math.ceil(totalItems / pageSize),
                    currentPage: page,
                    pageSize,
                },
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST,
            };
        }
    }
    
    static async getById(item_id) {
        try {
            let items = await Item.findOne({
                include: [
                    {
                        model: Category,
                        as: 'category',
                        include: [
                            {
                                model: Category,
                                as: 'category'
                            }
                        ]
                    },
                    {
                        model: Brand,
                        as: 'brand'
                    },
                    {
                        model: Collection,
                        as: 'collection'
                    },
                    {
                        model: ItemImage,
                        as: 'item_images',
                        order: [['id']]
                    },
                    // {
                    //     model: User,
                    //     as: 'manager'
                    // }
                ],
                where: {
                    id: item_id
                }
            });
        
            return {
                data: items,
                status: httpStatus.OK,
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }
    
    static async getByIdForUser(language, item_id, user_id = null) {
        const name = language === 'ar' ? 'Item.name_ar' : 'Item.name';
        const categoryName = language === 'ar' ? 'name_ar' : 'name';
        const collectionName = language === 'ar' ? 'name_ar' : 'name';
        const brandName = language === 'ar' ? 'name_ar' : 'name';
        const description = language === 'ar' ? 'Item.description_ar' : 'Item.description';
        try {
            let items = await Item.findOne({
                attributes: [
                    'id',
                    'price',
                    'storage',
                    'color',
                    'measure',
                    'paracode',
                    [sequelize.col(name), 'name'],
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
                where: {
                    id: item_id
                },
                // group: ['id', 'price', 'color', 'measure', 'name', 'description', 'rate']
            });
            
        
            return {
                data: items,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }
    
    static async getByNameForUser(language, search_name, user_id = null) {
        const name = language === 'ar' ? 'Item.name_ar' : 'Item.name';
        const categoryName = language === 'ar' ? 'name_ar' : 'name';
        const collectionName = language === 'ar' ? 'name_ar' : 'name';
        const brandName = language === 'ar' ? 'name_ar' : 'name';
        const description = language === 'ar' ? 'Item.description_ar' : 'Item.description';
        try {
            let items = await Item.findOne({
                attributes: [
                    'id',
                    'price',
                    'storage',
                    'color',
                    'measure',
                    'paracode',
                    [sequelize.col(name), 'name'],
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
                where: {
                    [Op.or]: [
                        {
                            name_ar: search_name
                        },
                        {
                            name: search_name
                        }
                    ]
                },
                // group: ['id', 'price', 'color', 'measure', 'name', 'description', 'rate']
            });
        
            return {
                data: items,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }
    
    static async getByIdNoInfo(item_id) {
        try {
            let items = await Item.findOne({
                attributes: [
                    'id',
                    'name'
                ],
                where: {
                    id: item_id
                },
            });
        
            return {
                data: items,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }
    
    static async getShowedWithLimit(user_id = null, language = 'ar', page= 1, pageSize= 10, limit = 500000) {
        const name = language === 'ar' ? 'Item.name_ar' : 'Item.name';
        const categoryName = language === 'ar' ? 'name_ar' : 'name';
        const collectionName = language === 'ar' ? 'name_ar' : 'name';
        const brandName = language === 'ar' ? 'name_ar' : 'name';
        const description = language === 'ar' ? 'Item.description_ar' : 'Item.description';
        // const offset = (page - 1) * pageSize;
        try {
            let items = await Item.findAll({
                attributes: [
                    'id',
                    'storage',
                    'price',
                    'color',
                    'paracode',
                    'measure',
                    [sequelize.col(name), 'name'],
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
                    // [sequelize.fn('sum', sequelize.col('rates.rate')), 'rating'],
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
                    },
                    // {
                    //     attributes: [],
                    //     model: Rate,
                    //     as: 'ratings'
                    // }
                ],
                where: {
                    is_show: true,
                    // storage: {
                    //     [Op.ne]: 0
                    // }
                },
                // order: [['id', 'DESC']],
                // group: ['id'],
                // limit: 4,
                // offset,
                order: [['id', 'DESC']],
            });
            
            // const totalItems = await Item.count({
            //     where: {
            //         is_show: true
            //     }
            // });
        
            return {
                data: items,
                status: httpStatus.OK,
                // pagination: {
                //     totalItems,
                //     totalPages: Math.ceil(totalItems / pageSize),
                //     currentPage: page,
                //     pageSize,
                // },
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }
    
    static async getShowedWithDiscountAndLimit(user_id = null, language = 'ar', page= 1, pageSize= 10, limit = 500000) {
        const name = language === 'ar' ? 'Item.name_ar' : 'Item.name';
        const categoryName = language === 'ar' ? 'name_ar' : 'name';
        const collectionName = language === 'ar' ? 'name_ar' : 'name';
        const brandName = language === 'ar' ? 'name_ar' : 'name';
        const description = language === 'ar' ? 'Item.description_ar' : 'Item.description';
        // const offset = (page - 1) * pageSize;
        try {
            let items = await Item.findAll({
                attributes: [
                    'id',
                    'storage',
                    'price',
                    'color',
                    'paracode',
                    'measure',
                    [sequelize.col(name), 'name'],
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
                    // [sequelize.fn('sum', sequelize.col('rates.rate')), 'rating'],
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
                    },
                    {
                        required: true,
                        model: Offer,
                        as: 'offers',
                    },
                    // {
                    //     attributes: [],
                    //     model: Rate,
                    //     as: 'ratings'
                    // }
                ],
                where: {
                    is_show: true,
                    // storage: {
                    //     [Op.ne]: 0
                    // }
                },
                // order: [['id', 'DESC']],
                // group: ['id'],
                // limit: 4,
                // offset,
                order: [['id', 'DESC']],
            });
            
            // const totalItems = await Item.count({
            //     where: {
            //         is_show: true
            //     }
            // });
        
            return {
                data: items,
                status: httpStatus.OK,
                // pagination: {
                //     totalItems,
                //     totalPages: Math.ceil(totalItems / pageSize),
                //     currentPage: page,
                //     pageSize,
                // },
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }
    
    static async getAllForOneName(language = 'ar', name = '', user_id = null) {
        const itemName = language === 'ar' ? 'Item.name_ar' : 'Item.name';
        const categoryName = language === 'ar' ? 'name_ar' : 'name';
        const collectionName = language === 'ar' ? 'name_ar' : 'name';
        const brandName = language === 'ar' ? 'name_ar' : 'name';
        const description = language === 'ar' ? 'Item.description_ar' : 'Item.description';
        // const offset = (page - 1) * pageSize;
        try {            
            let items = await Item.findAll({
                attributes: [
                    'id',
                    'storage',
                    'price',
                    'color',
                    'paracode',
                    'measure',
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
                    // [sequelize.fn('sum', sequelize.col('rates.rate')), 'rating'],
                ],
                include: [
                    {
                        attributes: [
                            'id',
                            'image',
                            [sequelize.col(categoryName), 'name']
                        ],
                        required: false,
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
                    },
                    // {
                    //     attributes: [],
                    //     model: Rate,
                    //     as: 'ratings'
                    // }
                ],
                where: {
                    is_show: true,
                    // storage: {
                    //     [Op.ne]: 0
                    // },
                    [Op.or]: [
                        {
                            name: {
                                [Op.like]: `%${name}%`
                            },
                        },
                        {
                            name_ar: {
                                [Op.like]: `%${name}%`
                            },
                        }
                    ],
                },
                // order: [['id', 'DESC']],
                // group: ['id'],
                // limit: +pageSize,
                // offset,
                order: [['id', 'DESC']],
            });
            
            // const totalItems = await Item.count({
            //     where: {
            //         is_show: true
            //     }
            // });
            
        
            return {
                data: items,
                status: httpStatus.OK,
                // pagination: {
                //     totalItems,
                //     totalPages: Math.ceil(totalItems / pageSize),
                //     currentPage: page,
                //     pageSize,
                // },
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }
    
    static async getAllForOneNameForOneCategory(language = 'ar', name = '', user_id = null, category_id) {
        const itemName = language === 'ar' ? 'Item.name_ar' : 'Item.name';
        const categoryName = language === 'ar' ? 'name_ar' : 'name';
        const collectionName = language === 'ar' ? 'name_ar' : 'name';
        const brandName = language === 'ar' ? 'name_ar' : 'name';
        const description = language === 'ar' ? 'Item.description_ar' : 'Item.description';
        // const offset = (page - 1) * pageSize;
        try {
            let items = await Item.findAll({
                attributes: [
                    'id',
                    'storage',
                    'price',
                    'color',
                    'paracode',
                    'measure',
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
                    // [sequelize.fn('sum', sequelize.col('rates.rate')), 'rating'],
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
                    },
                    // {
                    //     attributes: [],
                    //     model: Rate,
                    //     as: 'ratings'
                    // }
                ],
                where: {
                    is_show: true,
                    // storage: {
                    //     [Op.ne]: 0
                    // },
                    name: {
                        [Op.like]: `%${name}%`
                    },
                    category_id: category_id
                },
                // order: [['id', 'DESC']],
                // group: ['id'],
                // limit: +pageSize,
                // offset,
                order: [['id', 'DESC']],
            });
            
            // const totalItems = await Item.count({
            //     where: {
            //         is_show: true
            //     }
            // });
        
            return {
                data: items,
                status: httpStatus.OK,
                // pagination: {
                //     totalItems,
                //     totalPages: Math.ceil(totalItems / pageSize),
                //     currentPage: page,
                //     pageSize,
                // },
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }
    
    static async getAllForOneNameNoInfo(name) {
        try {
            let items = await Item.findAll({
                attributes: [
                    'id',
                ],
                where: {
                    name: name
                },
            })

            const ids = items.map(item => item.id);
        
            return {
                data: ids,
                status: httpStatus.OK,
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }
    
    static async getForOneMeasure(language = 'ar', measure = '', name = '', user_id = null) {
        const itemName = language === 'ar' ? 'Item.name_ar' : 'Item.name';
        const categoryName = language === 'ar' ? 'name_ar' : 'name';
        const collectionName = language === 'ar' ? 'name_ar' : 'name';
        const brandName = language === 'ar' ? 'name_ar' : 'name';
        const description = language === 'ar' ? 'Item.description_ar' : 'Item.description';
        try {
            let items = await Item.findOne({
                attributes: [
                    'id',
                    'storage',
                    'price',
                    'color',
                    'paracode',
                    'measure',
                    [sequelize.col(itemName), 'name'],
                    [sequelize.col(description), 'description'],
                    'rate'
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
                    },
                    // {
                    //     attributes: [],
                    //     model: Rate,
                    //     as: 'ratings'
                    // }
                ],
                where: {
                    is_show: true,
                    // storage: {
                    //     [Op.ne]: 0
                    // },
                    measure: measure,
                    name: name,
                },
                // order: [['id', 'DESC']],
                // group: ['id'],
                // limit: +pageSize,
                // offset,
                // order: [['id', 'DESC']],
            });
            
            // const totalItems = await Item.count({
            //     where: {
            //         is_show: true
            //     }
            // });
        
            return {
                data: items,
                status: httpStatus.OK,
                // pagination: {
                //     totalItems,
                //     totalPages: Math.ceil(totalItems / pageSize),
                //     currentPage: page,
                //     pageSize,
                // },
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }
    
    static async getShowedWithLimitInSpecificIds(ids, user_id = null, language = 'ar') {
        const name = language === 'ar' ? 'Item.name_ar' : 'Item.name';
        const categoryName = language === 'ar' ? 'name_ar' : 'name';
        const collectionName = language === 'ar' ? 'name_ar' : 'name';
        const brandName = language === 'ar' ? 'name_ar' : 'name';
        const description = language === 'ar' ? 'Item.description_ar' : 'Item.description';
        // const offset = (page - 1) * pageSize;
        try {
            let items = await Item.findAll({
                attributes: [
                    'id',
                    'storage',
                    'price',
                    'color',
                    'paracode',
                    'measure',
                    [sequelize.col(name), 'name'],
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
                    // [sequelize.literal(`FIELD(id, ${ids.join(', ')})`), 'ordered_id'],
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
                where: {
                    is_show: true,
                    id: {
                        [Op.in]: ids
                    }
                },
                // group: ['id'],
                // order: sequelize.literal(`FIELD(${Item.getTableName()}.id, ${ids.join(', ')})`),
                order: [
                    [
                        sequelize.literal(`
                            CASE Item.id
                            ${ids.map((id, index) => `WHEN ${id} THEN ${index}`).join('\n')}
                            END
                        `),
                        'ASC',
                    ],
                ],
            });
            
            // const totalItems = await Item.count();
        
            return {
                data: items,
                status: httpStatus.OK,
                // pagination: {
                //     totalItems,
                //     totalPages: Math.ceil(totalItems / pageSize),
                //     currentPage: page,
                //     pageSize,
                // },
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }
    
    static async getAllFavoriteForUser(data) {
        const name = data.language === 'ar' ? 'Item.name_ar' : 'Item.name';
        const categoryName = data.language === 'ar' ? 'name_ar' : 'name';
        const collectionName = data.language === 'ar' ? 'name_ar' : 'name';
        const brandName = data.language === 'ar' ? 'name_ar' : 'name';
        const description = data.language === 'ar' ? 'Item.description_ar' : 'Item.description';
        try {
            let items = await Item.findAll({
                attributes: [
                    'id',
                    'storage',
                    'price',
                    'color',
                    'paracode',
                    'measure',
                    [sequelize.col(name), 'name'],
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
                        required: true,
                        model: Favorite,
                        as: 'favorite',
                        where: {
                            user_id: data.user_id
                        }
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
                                    user_id: data.user_id
                                }
                            }
                        ]
                    },
                ],
                where: {
                    is_show: true,
                },
                // group: ['id']
            });
            
            // const totalItems = await Item.count();
        
            return {
                data: items,
                status: httpStatus.OK,
                // pagination: {
                //     totalItems,
                //     totalPages: Math.ceil(totalItems / pageSize),
                //     currentPage: page,
                //     pageSize,
                // },
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }
    
    // order depending on sum + fix created at issue
    static async getShowedMostSellingWithLimit(limit) {
        try {
            const today = new Date();
            const lastMonth = new Date();
            lastMonth.setMonth( lastMonth.getMonth() - 1);
            let items;            
            if (limit) {
                items = await Item.findAll({
                    attributes: [
                        'id',
                        // [sequelize.fn('sum', 'order_items.count'), 'sum'],
                        // 'rate'
                        [sequelize.literal(`(
                            SELECT SUM(oi.count)
                            FROM order_items oi
                            JOIN orders o ON oi.order_id = o.id
                            WHERE oi.item_id = Item.id
                                AND o.created_at BETWEEN '${lastMonth.toISOString()}' AND '${today.toISOString()}'
                            )`, 'sum'),
                            'sum'
                        ],
                    ],
                    include: [
                        {
                            attributes: [
                                'id',
                                // [sequelize.fn('sum', sequelize.col('count')), 'sum'],
                            ],
                            model: OrderItem,
                            as: 'order_items',
                            include: [
                                {
                                    required: true,
                                    model: Order,
                                    as: 'order',
                                    where: {
                                        created_at: {
                                            [Op.between]: [lastMonth, today]
                                        }
                                    }
                                }
                            ]
                        },
                        // {
                        //     model: ItemImage,
                        //     as: 'item_images'
                        // },
                        // {
                        //     model: Favorite,
                        //     as: 'favorite',
                        //     where: {
                        //         user_id: user_id
                        //     }
                        // }
                    ],
                    where: {
                        is_show: true,
                    },
                    // group: ['id'],
                    order: [[sequelize.literal('`sum`'), 'DESC']],
                    // order: [[sequelize.literal(`order_items.sum`), 'DESC']],
                    // order: [['items->order_items.sum', 'DESC']],
                    // limit: +limit,
                });
                
            } else {
                items = await Item.findAll({
                    attributes: [
                        'id',
                        // [sequelize.fn('sum', 'order_items.count'), 'sum'],
                        // 'rate'
                        [sequelize.literal(`(
                            SELECT SUM(oi.count)
                            FROM order_items oi
                            JOIN orders o ON oi.order_id = o.id
                            WHERE oi.item_id = Item.id
                                AND o.created_at BETWEEN '${lastMonth.toISOString()}' AND '${today.toISOString()}'
                            )`, 'sum'),
                            'sum'
                        ],
                    ],
                    include: [
                        {
                            attributes: [
                                'id',
                                // [sequelize.fn('sum', sequelize.col('count')), 'sum'],
                            ],
                            model: OrderItem,
                            as: 'order_items',
                            include: [
                                {
                                    required: true,
                                    model: Order,
                                    as: 'order',
                                    where: {
                                        created_at: {
                                            [Op.between]: [lastMonth, today]
                                        }
                                    }
                                }
                            ]
                        },
                        // {
                        //     model: ItemImage,
                        //     as: 'item_images'
                        // },
                        // {
                        //     model: Favorite,
                        //     as: 'favorite',
                        //     where: {
                        //         user_id: user_id
                        //     }
                        // }
                    ],
                    where: {
                        is_show: true,
                    },
                    // group: ['id'],
                    order: [[sequelize.literal('`sum`'), 'DESC']],
                    // order: [[sequelize.literal(`order_items.sum`), 'DESC']],
                    // order: [['items->order_items.sum', 'DESC']],
                });

            }
        
            return {
                data: items,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }
    
    static async getAllForOneBrand(brand_id, page= 1, pageSize= 10) {
        try {
            const offset = (page - 1) * pageSize;
            let items = await Item.findAll({
                include: [
                    {
                        model: Category,
                        as: 'category'
                    },
                    {
                        model: Brand,
                        as: 'brand'
                    },
                    {
                        model: Collection,
                        as: 'collection'
                    },
                    {
                        model: ItemImage,
                        as: 'item_images'
                    },
                    // {
                    //     model: User,
                    //     as: 'manager'
                    // }
                ],
                where: {
                    brand_id: brand_id
                },
                limit: +pageSize,
                offset,
                order: [['id', 'DESC']],
            });
            
            const totalItems = await Item.count({
                where: {
                    brand_id: brand_id
                }
            });
        
            return {
                data: items,
                status: httpStatus.OK,
                pagination: {
                    totalItems,
                    totalPages: Math.ceil(totalItems / pageSize),
                    currentPage: page,
                    pageSize,
                },
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }
    
    static async getAllForOneCollection(collection_id, page= 1, pageSize= 10) {
        try {
            const offset = (page - 1) * pageSize;
            let items = await Item.findAll({
                include: [
                    {
                        model: Category,
                        as: 'category',
                        include: [
                            {
                                model: Category,
                                as: 'category'
                            }
                        ]
                    },
                    {
                        model: Brand,
                        as: 'brand'
                    },
                    {
                        model: ItemImage,
                        as: 'item_images'
                    },
                    // {
                    //     model: User,
                    //     as: 'manager'
                    // }
                ],
                where: {
                    collection_id: collection_id
                },
                limit: +pageSize,
                offset,
                order: [['id', 'DESC']],
            });
            
            const totalItems = await Item.count({
                where: {
                    collection_id: collection_id
                }
            });
        
            return {
                data: items,
                status: httpStatus.OK,
                pagination: {
                    totalItems,
                    totalPages: Math.ceil(totalItems / pageSize),
                    currentPage: page,
                    pageSize,
                },
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }
    
    static async getAllShowedForOneCollection(user_id = null, collection_id = null, language = 'ar', page= 1, pageSize= 10) {
        try {
            const name = language === 'ar' ? 'Item.name_ar' : 'Item.name';
            const categoryName = language === 'ar' ? 'name_ar' : 'name';
            const collectionName = language === 'ar' ? 'name_ar' : 'name';
            const brandName = language === 'ar' ? 'name_ar' : 'name';
            const description = language === 'ar' ? 'Item.description_ar' : 'Item.description';
            // const offset = (page - 1) * pageSize;
            let items = await Item.findAll({
                attributes: [
                    'id',
                    'storage',
                    'price',
                    'color',
                    'paracode',
                    'measure',
                    [sequelize.col(name), 'name'],
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
                            [sequelize.col(brandName), 'name'],
                        ],
                        model: Brand,
                        as: 'brand'
                    },
                    {
                        attributes: [
                            'id',
                            'image',
                            [sequelize.col(collectionName), 'name'],
                        ],
                        model: Collection,
                        as: 'collection'
                    },
                    {
                        model: ItemImage,
                        as: 'item_images'
                    },
                    // {
                    //     model: User,
                    //     as: 'manager'
                    // },
                    {
                        required: false,
                        model: Favorite,
                        as: 'favorite',
                        where: {
                            user_id: user_id
                        }
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
                ],
                where: {
                    collection_id: collection_id,
                    is_show: true,
                    // storage: {
                    //     [Op.ne]: 0
                    // }
                },
                // group: ['id'],
                // limit: +pageSize,
                // offset,
                order: [['id', 'DESC']],
            });
            
            // const totalItems = await Item.count({
            //     where: {
            //         collection_id: collection_id,
            //         is_show: true
            //     }
            // });
        
            return {
                data: items,
                status: httpStatus.OK,
                // pagination: {
                //     totalItems,
                //     totalPages: Math.ceil(totalItems / pageSize),
                //     currentPage: page,
                //     pageSize,
                // },
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }
    
    static async getAllShowedForOneBrand(user_id = null, brand_id = null, language = 'ar', page= 1, pageSize= 10) {
        try {
            const name = language === 'ar' ? 'Item.name_ar' : 'Item.name';
            const categoryName = language === 'ar' ? 'name_ar' : 'name';
            const collectionName = language === 'ar' ? 'name_ar' : 'name';
            const brandName = language === 'ar' ? 'name_ar' : 'name';
            const description = language === 'ar' ? 'Item.description_ar' : 'Item.description';
            // const offset = (page - 1) * pageSize;
            let items = await Item.findAll({
                attributes: [
                    'id',
                    'storage',
                    'price',
                    'color',
                    'paracode',
                    'measure',
                    [sequelize.col(name), 'name'],
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
                            [sequelize.col(brandName), 'name'],
                        ],
                        model: Brand,
                        as: 'brand'
                    },
                    {
                        attributes: [
                            'id',
                            'image',
                            [sequelize.col(collectionName), 'name'],
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
                    // {
                    //     model: User,
                    //     as: 'manager'
                    // },
                    {
                        required: false,
                        model: Favorite,
                        as: 'favorite',
                        where: {
                            user_id: user_id
                        }
                    }
                ],
                where: {
                    brand_id: brand_id,
                    is_show: true,
                    // storage: {
                    //     [Op.ne]: 0
                    // }
                },
                // group: ['id'],
                // limit: +pageSize,
                // offset,
                order: [['id', 'DESC']],
            });
            
            // const totalItems = await Item.count({
            //     where: {
            //         brand_id: brand_id,
            //         is_show: true
            //     }
            // });
        
            return {
                data: items,
                status: httpStatus.OK,
                // pagination: {
                //     totalItems,
                //     totalPages: Math.ceil(totalItems / pageSize),
                //     currentPage: page,
                //     pageSize,
                // },
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }
    
    static async getAllForOneCategory(category_id, page= 1, pageSize= 10) {
        try {
            const offset = (page - 1) * pageSize;
            let items = await Item.findAll({
                include: [
                    {
                        model: Category,
                        as: 'category',
                        include: [
                            {
                                model: Category,
                                as: 'category'
                            }
                        ]
                    },
                    {
                        model: Brand,
                        as: 'brand'
                    },
                    {
                        model: Collection,
                        as: 'collection'
                    },
                    {
                        model: ItemImage,
                        as: 'item_images'
                    },
                    // {
                    //     model: User,
                    //     as: 'manager'
                    // }
                ],
                where: {
                    category_id: category_id
                },
                // group: ['id'],
                limit: +pageSize,
                offset,
                order: [['id', 'DESC']],
            });
            
            const totalItems = await Item.count({
                where: {
                    category_id: category_id
                }
            });
        
            return {
                data: items,
                status: httpStatus.OK,
                pagination: {
                    totalItems,
                    totalPages: Math.ceil(totalItems / pageSize),
                    currentPage: page,
                    pageSize,
                },
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }
    
    static async getAllShowedForOneCategory(user_id = null, category_id = null, language = 'ar', page= 1, pageSize= 10) {
        try {
            const name = language === 'ar' ? 'Item.name_ar' : 'Item.name';
            const categoryName = language === 'ar' ? 'name_ar' : 'name';
            const collectionName = language === 'ar' ? 'name_ar' : 'name';
            const brandName = language === 'ar' ? 'name_ar' : 'name';
            const description = language === 'ar' ? 'Item.description_ar' : 'Item.description';
            // const offset = (page - 1) * pageSize;
            let items = await Item.findAll({
                attributes: [
                    'id',
                    'storage',
                    'price',
                    'color',
                    'paracode',
                    'measure',
                    [sequelize.col(name), 'name'],
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
                            [sequelize.col(brandName), 'name'],
                        ],
                        model: Brand,
                        as: 'brand'
                    },
                    {
                        attributes: [
                            'id',
                            'image',
                            [sequelize.col(collectionName), 'name'],
                        ],
                        model: Collection,
                        as: 'collection'
                    },
                    {
                        model: ItemImage,
                        as: 'item_images'
                    },
                    // {
                    //     model: User,
                    //     as: 'manager'
                    // },
                    {
                        required: false,
                        model: Favorite,
                        as: 'favorite',
                        where: {
                            user_id: user_id
                        }
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
                    }
                ],
                where: {
                    category_id: category_id,
                    is_show: true,
                    // storage: {
                    //     [Op.ne]: 0
                    // }
                },
                // group:['id'],
                // limit: +pageSize,
                // offset,
                order: [['id', 'DESC']],
            });
            
            // const totalItems = await Item.count({
            //     where: {
            //         category_id: category_id,
            //         is_show: true
            //     }
            // });
        
            return {
                data: items,
                status: httpStatus.OK,
                // pagination: {
                //     totalItems,
                //     totalPages: Math.ceil(totalItems / pageSize),
                //     currentPage: page,
                //     pageSize,
                // },
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }
    
    static async getAllShowedItemsForOnePrimaryCategory(user_id = null, category_id = null, language = 'ar', page= 1, pageSize= 10) {
        try {
            const name = language === 'ar' ? 'Item.name_ar' : 'Item.name';
            const categoryName = language === 'ar' ? 'name_ar' : 'name';
            const collectionName = language === 'ar' ? 'name_ar' : 'name';
            const brandName = language === 'ar' ? 'name_ar' : 'name';
            const description = language === 'ar' ? 'Item.description_ar' : 'Item.description';
            // const offset = (page - 1) * pageSize;
            let items = await Item.findAll({
                attributes: [
                    'id',
                    'storage',
                    'price',
                    'color',
                    'paracode',
                    'measure',
                    [sequelize.col(name), 'name'],
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
                        required: true,
                        attributes: [
                            'id',
                            'image',
                            [sequelize.col(categoryName), 'name']
                        ],
                        model: Category,
                        as: 'category',
                        include: [
                            {
                                required: true,
                                attributes: [
                                    'id',
                                    'image',
                                    [sequelize.col(categoryName), 'name']
                                ],
                                model: Category,
                                as: 'category',
                                where: {
                                    id: category_id
                                }
                            }
                        ]
                    },
                    {
                        attributes: [
                            'id',
                            'image',
                            [sequelize.col(brandName), 'name'],
                        ],
                        model: Brand,
                        as: 'brand'
                    },
                    {
                        attributes: [
                            'id',
                            'image',
                            [sequelize.col(collectionName), 'name'],
                        ],
                        model: Collection,
                        as: 'collection'
                    },
                    {
                        model: ItemImage,
                        as: 'item_images'
                    },
                    // {
                    //     model: User,
                    //     as: 'manager'
                    // },
                    {
                        required: false,
                        model: Favorite,
                        as: 'favorite',
                        where: {
                            user_id: user_id
                        }
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
                    }
                ],
                where: {
                    is_show: true,
                    // storage: {
                    //     [Op.ne]: 0
                    // }
                },
                // group:['id'],
                // limit: +pageSize,
                // offset,
                order: [['id', 'DESC']],
            });
            
            // const totalItems = await Item.count({
            //     where: {
            //         category_id: category_id,
            //         is_show: true
            //     }
            // });
        
            return {
                data: items,
                status: httpStatus.OK,
                // pagination: {
                //     totalItems,
                //     totalPages: Math.ceil(totalItems / pageSize),
                //     currentPage: page,
                //     pageSize,
                // },
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

}

module.exports = { ItemService };