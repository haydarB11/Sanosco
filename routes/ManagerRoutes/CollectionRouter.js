const {
	addCollection,
	editCollection,
	deleteCollection,
	getAllCollections,
} = require('../../controllers/ManagerControllers/CollectionController');
const { getAllItemsForOneCollection } = require('../../controllers/ManagerControllers/ItemController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');
const { uploadCollection } = require('../../utils/uploadFiles/uploadDestinations')

router.use(isAuth);

router.post('/', uploadCollection.single('image'), addCollection);

router.put('/:collection_id', uploadCollection.single('image'), editCollection);

router.delete('/:collection_id', deleteCollection);

router.get('/', getAllCollections);

router.get('/:collection_id/items', getAllItemsForOneCollection);

module.exports = router;