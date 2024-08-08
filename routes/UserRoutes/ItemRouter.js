const {
	getShowedItemsWithLimit,
	getItemById,
	getMostSellingShowedItemsWithLimit,
	getItemByMeasure,
	getItemByName,
	getAllShowedItemWithDiscount,
	SearchForItemInOneCategory,
	// getNewShowedItemsWithLimit,
} = require('../../controllers/UserControllers/ItemController');
const router = require('express').Router();
const mayAuth = require('../../utils/auth/mayAuth');

router.use(mayAuth);

router.get('/', getShowedItemsWithLimit);

router.get('/most-selling', getMostSellingShowedItemsWithLimit);

// router.get('/new', getNewShowedItemsWithLimit);

router.get('/measure', getItemByMeasure);

router.get('/offer', getAllShowedItemWithDiscount);

router.get('/name', getItemByName);

router.get('/category/search', SearchForItemInOneCategory);

router.get('/category/search/:category_id', SearchForItemInOneCategory);

router.get('/:item_id', getItemById);



module.exports = router;