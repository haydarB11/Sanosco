const {
	getAllAdvertisements,
	getAdvertisementById
} = require('../../controllers/UserControllers/AdvertisementController');
const router = require('express').Router();
const mayAuth = require('../../utils/auth/mayAuth');

router.use(mayAuth);

router.get('/', getAllAdvertisements);

router.get('/:advertisement_id', getAdvertisementById);

module.exports = router;