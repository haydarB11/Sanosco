const { BrandService } = require('../../services/BrandService');


module.exports = {

    addBrand: async (req, res) => {
        const data = req.body;
        data.image = req.file.path;
        const result = await new BrandService(req.body).add();
        res.status(result.status).send({
            data: result.data,
        });
    },

    editBrand: async (req, res) => {
        const data = req.body;
        data.id = req.params.brand_id;
        data.image = req.file?.path;
        const result = await BrandService.edit(data);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllBrands: async (req, res) => {
        const result = await BrandService.getAll();
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllCategoriesWIthSubCategories: async (req, res) => {
        const result = await BrandService.getAllWIthSubCategories();
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllCategoriesForOneBrand: async (req, res) => {
        const result = await BrandService.getAllForOneBrand(req.params.brand_id);
        res.status(result.status).send({
            data: result.data,
        });
    },

    deleteBrand: async (req, res) => {
        const result = await BrandService.delete(req.params.brand_id);
        res.status(result.status).send({
            data: result.data,
        });
    }

}