const { CollectionService } = require('../../services/CollectionService');


module.exports = {

    getAllShowedCollections: async (req, res) => {
        const result = await CollectionService.getAllShowed(req.query.language);
        res.status(result.status).send({
            data: result.data,
        });
    },

}