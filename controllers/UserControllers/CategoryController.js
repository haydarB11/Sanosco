const { CategoryService } = require('../../services/CategoryService');


module.exports = {

    getAllShowedCategories: async (req, res) => {
        const result = await CategoryService.getAllShowed(req.query.language);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllShowedPrimaryCategories: async (req, res) => {
        const result = await CategoryService.getAllShowedPrimary(req.query.language);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllShowedSecondaryCategories: async (req, res) => {
        const result = await CategoryService.getAllShowedSecondary(req.query?.language, req.params.category_id);
        res.status(result.status).send({
            data: result.data,
        });
    },

}