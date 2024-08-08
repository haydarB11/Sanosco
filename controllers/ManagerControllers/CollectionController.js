const { CollectionService } = require('../../services/CollectionService');


module.exports = {

    addCollection: async (req, res) => {
        const data = req.body;
        data.image = req.file.path;
        const result = await new CollectionService(req.body).add();
        res.status(result.status).send({
            data: result.data,
        });
    },

    editCollection: async (req, res) => {
        const data = req.body;
        data.id = req.params.collection_id;
        data.image = req.file?.path;
        const result = await CollectionService.edit(data);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllCollections: async (req, res) => {
        const result = await CollectionService.getAll();
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllCategoriesWIthSubCategories: async (req, res) => {
        const result = await CollectionService.getAllWIthSubCategories();
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllCategoriesForOneCollection: async (req, res) => {
        const result = await CollectionService.getAllForOneCollection(req.params.collection_id);
        res.status(result.status).send({
            data: result.data,
        });
    },

    deleteCollection: async (req, res) => {
        const result = await CollectionService.delete(req.params.collection_id);
        res.status(result.status).send({
            data: result.data,
        });
    }

}