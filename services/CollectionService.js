const { Collection } = require('../models');
const httpStatus = require('../utils/httpStatus');
const sequelize = require('sequelize');

class CollectionService {

    constructor(data) {
        this.name = data.name;
        this.name_ar = data.name;
        // this.name_ar = data.name_ar;
        this.image = data.image;
        this.is_show = data.is_show;
    }

    async add() {
        try {
            const collection = await Collection.create(this);
            return {
                data: collection,
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
            const collection = await Collection.findByPk(data.id);
            collection.name = data.name || collection.name;
            collection.name_ar = data.name || collection.name;
            // collection.name_ar = data.name_ar || collection.name_ar;
            collection.image = data.image || collection.image;
            collection.is_show = data.is_show || collection.is_show;
            await collection.save();
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
            const deletedCollection = await Collection.destroy({
                where: {
                    id: id
                }
            });
            if (deletedCollection === 1) {
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
            const collections = await Collection.count({});
            return {
                data: collections,
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
            const collections = await Collection.findAll({});
            return {
                data: collections,
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
            const columnName = language === 'ar' ? 'Collection.name_ar' : 'Collection.name';
            const collections = await Collection.findAll({
                attributes: [
                    'id',
                    [sequelize.col(columnName), 'name'],
                    'is_show',
                    'image',
                ],
                where: {
                    is_show: true
                }
            });
            return {
                data: collections,
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

module.exports = { CollectionService };