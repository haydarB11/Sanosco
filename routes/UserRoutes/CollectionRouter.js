const {
	getAllShowedCollections,
} = require('../../controllers/UserControllers/CollectionController');
const { getAllShowedItemsForOneCollection } = require('../../controllers/UserControllers/ItemController');
const router = require('express').Router();
const mayAuth = require('../../utils/auth/mayAuth');

router.use(mayAuth);

router.get('/', getAllShowedCollections);

router.get('/:collection_id/items', getAllShowedItemsForOneCollection);

module.exports = router;