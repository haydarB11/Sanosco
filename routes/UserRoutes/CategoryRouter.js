const {
	getAllShowedCategories,
	getAllShowedPrimaryCategories,
	getAllShowedSecondaryCategories
} = require('../../controllers/UserControllers/CategoryController');
const { getAllShowedItemsForOneCategory, getAllShowedItemsForOnePrimaryCategory } = require('../../controllers/UserControllers/ItemController');
const { getAllShowedBrandsForOneCategory } = require('../../controllers/UserControllers/BrandController');
const router = require('express').Router();
const mayAuth = require('../../utils/auth/mayAuth');

router.use(mayAuth);

router.get('/', getAllShowedCategories);

router.get('/primary', getAllShowedPrimaryCategories);

router.get('/secondary/:category_id', getAllShowedSecondaryCategories);

router.get('/:category_id/items', getAllShowedItemsForOneCategory); 

router.get('/primary/:category_id/items', getAllShowedItemsForOnePrimaryCategory); 

router.get('/:category_id/brands', getAllShowedBrandsForOneCategory);

module.exports = router;