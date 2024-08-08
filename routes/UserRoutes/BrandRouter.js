const {
	getAllShowedBrands,
} = require('../../controllers/UserControllers/BrandController');
const { getAllShowedItemsForOneBrand } = require('../../controllers/UserControllers/ItemController');
const router = require('express').Router();
const mayAuth = require('../../utils/auth/mayAuth');

router.use(mayAuth);

router.get('/', getAllShowedBrands);

router.get('/:brand_id/items', getAllShowedItemsForOneBrand);

module.exports = router;