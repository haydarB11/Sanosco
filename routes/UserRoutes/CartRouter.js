const {
	addCartWithItsItems,
	getMyCartWithItsItems,
	deleteMyCart,
	addItemToCart,
	removeItemFromCart,
	removeManyItemFromCart,
} = require('../../controllers/UserControllers/CartController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

router.post('/', addCartWithItsItems);

router.post('/add-item', addItemToCart);

router.delete('/remove-item', removeItemFromCart);

router.delete('/remove-many', removeManyItemFromCart);

router.get('/', getMyCartWithItsItems);

router.delete('/', deleteMyCart);

module.exports = router;