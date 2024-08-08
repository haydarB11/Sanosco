const { CategoryService } = require('../../services/CategoryService');
const { Category, Item, Brand, Collection } = require('../../models');
const fs = require('fs');
const xlsx = require('xlsx');
const excel = require('exceljs');


module.exports = {

    addCategory: async (req, res) => {
        const data = req.body;
        data.image = req.file.path;
        const result = await new CategoryService(data).add();
        res.status(result.status).send({
            data: result.data,
        });
    },

    editCategory: async (req, res) => {
        const data = req.body;
        data.image = req.file?.path;
        data.id = req.params.category_id;
        const result = await CategoryService.edit(data);
        res.status(result.status).send({
            data: result.data,
        });
    },

    deleteCategory: async (req, res) => {
        const result = await CategoryService.delete(req.params.category_id);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllCategories: async (req, res) => {
        const result = await CategoryService.getAll();
        res.status(result.status).send({
            data: result.data,
        });
    },

    addQuestionWithAnswersFromExcelFile: async (req, res) => {
        // let transaction;
        try {
            // console.log('nn');
            const { path } = req.file;
            // console.log(path);
            // console.log(req.file);
            // console.log(req.body);
                // transaction = await sequelize.transaction();
                let data = {};
                const workbook = xlsx.readFile(path);
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = xlsx.utils.sheet_to_json(sheet);
                for (const record of jsonData) {
                    const existingCategory = await Category.findOne({ where: { name: record["التصنيف الأساسي"] || '' } });
                    const existingSubCategory = await Category.findOne({ where: { name: record["التصنيف الثانوي"] || '' } });
                    const existingBrand = await Brand.findOne({ where: { name: record["الماركة"] || '' } });
                    const existingCollection = await Collection.findOne({ where: { name: record["المجموعة"] || '' } });
                    const existingItem = await Item.findOne({ where: { name: record["الاسم الإنكليزي"] || '', measure: record["القياس"] || '' } });

                    if (!existingCategory && record["التصنيف الأساسي"]) {
                        const newCategory = await Category.create({ name: record["التصنيف الأساسي"], name_ar: record["التصنيف الأساسي"] || '', image: ''});
                        data.category_id = newCategory.id;
                    } else {
                        data.category_id = existingCategory?.id;
                    }

                    if (!existingSubCategory && record["التصنيف الثانوي"]) {
                        const newSubCategory = await Category.create({ name: record["التصنيف الثانوي"], name_ar: record["التصنيف الثانوي"] || '', image: '', category_id: data.category_id});
                        data.sub_category_id = newSubCategory.id;
                    } else {
                        data.sub_category_id = existingSubCategory?.id;
                    }

                    if (!existingBrand && record["الماركة"]) {
                        const newBrand = await Brand.create({ name: record["الماركة"], name_ar: record["الماركة"] || '', image: ''});
                        data.brand_id = newBrand.id;
                    } else {
                        data.brand_id = existingBrand?.id;
                    }

                    if (!existingCollection && record["المجموعة"]) {
                        const newCollection = await Collection.create({ name: record["المجموعة"], name_ar: record["المجموعة"] || '', image: ''});
                        data.collection_id = newCollection.id;
                    } else {
                        data.collection_id = existingCollection?.id;
                    }

                    if (!existingItem && record["الاسم الإنكليزي"]) {
                        const item = await Item.create({
                            name: record["الاسم الإنكليزي"],
                            name_ar: record["الاسم العربي"],
                            description: record["Description"],
                            description_ar: record["Description"],
                            color: record["اللون"] || '',
                            measure: record["القياس"] || '',
                            paracode: record["الرمز"],
                            price: 10,
                            brand_id: data.brand_id,
                            collection_id: data.collection_id,
                            category_id: data.sub_category_id,
                            manager_id: req.user.id,
                            storage: record["العدد"] || 0
                        });
                    } else if (existingItem) {
                        existingItem.storage += record["العدد"] || 0;
                        await existingItem.save();
                    }

                    data = {};
                    
                }

                // await transaction.commit();

                fs.unlinkSync(path);
                res.status(200).json({ data: 'Excel data imported successfully' });
        } catch (error) {
            console.error('Error importing Excel data:', error);
            res.status(500).json({ data: 'Error importing Excel data' });
        }
    },

    // addQuestionWithAnswersFromExcelFile: async (req, res) => {
        
    //     try {
    //         const { path } = req.file;
    //             const workbook = xlsx.readFile(path);
    //             const sheetName = workbook.SheetNames[0];
    //             const sheet = workbook.Sheets[sheetName];
    //             const jsonData = xlsx.utils.sheet_to_json(sheet);
    //             for (const record of jsonData) {
    //                 const imageUrl = record["صورة"];
    //             }

    //             fs.unlinkSync(path);
    //             res.status(200).json({ data: 'Excel data imported successfully' });
    //     } catch (error) {
    //         console.error('Error importing Excel data:', error);
    //         res.status(500).json({ data: 'Error importing Excel data' });
    //     }
    // },

}