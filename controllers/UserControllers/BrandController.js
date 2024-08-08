const { BrandService } = require('../../services/BrandService');


module.exports = {

    getAllShowedBrands: async (req, res) => {
        const result = await BrandService.getAllShowed(req.query.language);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllShowedBrandsForOneCategory: async (req, res) => {
        const result = await BrandService.getAllShowedForOneCategory(req.query.language, req.params.category_id);
        res.status(result.status).send({
            data: result.data,
        });
    },

}