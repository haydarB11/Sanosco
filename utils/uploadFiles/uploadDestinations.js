const { upload } = require('./multerUpload');

const uploadItem = upload('public/Items');
const uploadCategory = upload('public/Categories');
const uploadBrand = upload('public/Brands');
const uploadAdvertisement = upload('public/Advertisements');
const uploadCollection = upload('public/Collections');

module.exports = {
    uploadItem,
    uploadCategory,
    uploadBrand,
    uploadAdvertisement,
    uploadCollection
};