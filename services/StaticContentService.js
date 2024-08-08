const { 
    StaticContent,
} = require('../models');
const httpStatus = require('../utils/httpStatus');
const sequelize = require('sequelize');
const Op = sequelize.Op;

class StaticContentService {

    constructor(data) {
        this.title = data.title;
        this.description = data.description;
        this.description_ar = data.description_ar;
        this.content = data.content;
        this.content_ar = data.content_ar;
    }

    static async getAll() {
        try {
            const staticContents = await StaticContent.findAll({});
            return {
                data: staticContents,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllContact(language) {
        try {
            const description = language === 'ar' ? 'description_ar' : 'description';
            const content = language === 'ar' ? 'content_ar' : 'content';
            const staticContents = await StaticContent.findAll({
                attributes: [
                    'id',
                    'title',
                    [sequelize.col(description), 'description'],
                    [sequelize.col(content), 'content']
                ],
                where: {
                    title: {
                        [Op.in]: ['what', 'instagram', 'facebook', 'email', 'phone']
                    }
                }
            });
            return {
                data: staticContents,
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
            const description = language === 'ar' ? 'description_ar' : 'description';
            const content = language === 'ar' ? 'content_ar' : 'content';
            const staticContents = await StaticContent.findAll({
                attributes: [
                    'id',
                    'title',
                    [sequelize.col(description), 'description'],
                    [sequelize.col(content), 'content']
                ]
            });
            return {
                data: staticContents,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getDependingOnTitle(title) {
        try {
            const staticContent = await StaticContent.findOne({
                where: {
                    title: title
                }
            });
            return {
                data: staticContent,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getDependingOnTitleForLanguage(title, language) {
        try {
            const description = language === 'ar' ? 'description_ar' : 'description';
            const content = language === 'ar' ? 'content_ar' : 'content';
            const staticContent = await StaticContent.findOne({
                attributes: [
                    'id',
                    'title',
                    [sequelize.col(description), 'description'],
                    [sequelize.col(content), 'content']
                ],
                where: {
                    title: title
                }
            });
            return {
                data: staticContent,
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
            const staticContent = await StaticContent.findByPk(data.id);
            staticContent.title = data.title || staticContent.title;
            staticContent.description = data.description || staticContent.description;
            staticContent.description_ar = data.description_ar || staticContent.description_ar;
            staticContent.content = data.content || staticContent.content;
            staticContent.content_ar = data.content_ar || staticContent.content_ar;
            if (data.is_show == true || data.is_show == false) { 
                staticContent.is_show = data.is_show;
            }
            await staticContent.save();
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

}

module.exports = { StaticContentService };