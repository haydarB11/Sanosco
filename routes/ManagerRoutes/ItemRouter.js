const { 
	addItemWithItsImages,
	deleteItem,
	getAllItems,
	editItemWithItsImages,
	getItemById,
	getAllItemsWithFilter,
	getAllItemsWithFilterForBrand,
	getAllItemsWithFilterForCollection,
	// getAllItemsWithFilterForCategory,
	getAllItemsWithFilterForPCategory,
	getAllItemsWithFilterForSCategory,
	getAllItemsWithNoStorage,
} = require('../../controllers/ManagerControllers/ItemController');
const { deleteManyItemImage, addItemImages, editItemImage, getAllItemImagesWithNoItem } = require('../../controllers/ManagerControllers/ItemImageController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');
const { uploadItem } = require('../../utils/uploadFiles/uploadDestinations')

router.use(isAuth);

router.post('/', uploadItem.array('images'), addItemWithItsImages);

router.get('/images/not-related', getAllItemImagesWithNoItem);

router.put('/:item_id', uploadItem.array('images'), editItemWithItsImages);

router.delete('/:item_id', deleteItem);

router.get('/filter', getAllItemsWithFilter); // add filter to price and other stuff

router.get('/brand/filter', getAllItemsWithFilterForBrand); // add filter to price and other stuff

router.get('/collection/filter', getAllItemsWithFilterForCollection); // add filter to price and other stuff

router.get('/category-p/filter', getAllItemsWithFilterForPCategory); // add filter to price and other stuff

router.get('/category-S/filter', getAllItemsWithFilterForSCategory); // add filter to price and other stuff

router.get('/empty', getAllItemsWithNoStorage);

router.get('/:item_id', getItemById);

router.get('/', getAllItems);

router.delete('/images/delete', deleteManyItemImage);

router.post('/images/:item_id', uploadItem.array('images'), addItemImages);

router.put('/images/set-primary', editItemImage);


module.exports = router;