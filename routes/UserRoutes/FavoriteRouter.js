const {
	addToFavorite,
	deleteFromFavorite,
	getMyFavorites
} = require('../../controllers/UserControllers/FavoriteController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

router.post('/add/:item_id', addToFavorite);

router.post('/:item_id', addToFavorite);

router.get('/', getMyFavorites);

router.delete('/:item_id', deleteFromFavorite);

module.exports = router;