const {
	addOffer,
	deleteOffer,
	editOffer,
	getAllOffers,
	deleteOneOffer
} = require('../../controllers/ManagerControllers/OfferController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

router.post('/',  addOffer);

router.put('/:offer_id',  editOffer);

router.delete('/', deleteOffer);

router.delete('/:offer_id', deleteOneOffer);

router.get('/', getAllOffers);

module.exports = router;