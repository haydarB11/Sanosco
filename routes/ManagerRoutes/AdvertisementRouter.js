const {
	addAdvertisement,
	editAdvertisement,
	deleteAdvertisement,
	getAllAdvertisements,
	getAdvertisementById,
} = require('../../controllers/ManagerControllers/AdvertisementController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');
const { uploadAdvertisement } = require('../../utils/uploadFiles/uploadDestinations');

router.use(isAuth);

router.post('/',  uploadAdvertisement.single('image'), addAdvertisement);

router.put('/:advertisement_id',  uploadAdvertisement.single('image'), editAdvertisement);

router.delete('/', deleteAdvertisement);

router.get('/', getAllAdvertisements);

router.get('/:advertisement_id', getAdvertisementById);

module.exports = router;