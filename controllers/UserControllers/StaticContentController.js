const { StaticContentService } = require('../../services/StaticContentService');


module.exports = {
    
    getStaticContentDependingOnTitle: async (req, res) => {
        const result = await StaticContentService.getDependingOnTitleForLanguage(req.query.title, req.query.language);
        res.status(result.status).send({
            data: result.data,
        });
    },
    
    getAllContactStaticContent: async (req, res) => {
        const result = await StaticContentService.getAllContact(req.query.language);
        const data = {};
        for (const item of result.data) {
            data[item.title] = item.content;
        }
        // const data = result.data.map(item => ({
            
        // }))
        res.status(result.status).send({
            data: data,
        });
    },

}