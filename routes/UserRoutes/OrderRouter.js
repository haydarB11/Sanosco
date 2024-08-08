const {
	addOrderWithItsItems,
	getMyOrders,
	cancelOrder,
	editOrder,
	reOrderOrderWithItsItems,
	getOrderById,
	addOrderWithItsItemsWithOutDeletingCart,
} = require('../../controllers/UserControllers/OrderController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

router.post('/', addOrderWithItsItems);

router.post('/order', addOrderWithItsItemsWithOutDeletingCart);

router.post('/reorder/:order_id', reOrderOrderWithItsItems);

router.get('/', getMyOrders);

router.put('/cancel/:order_id', cancelOrder);

router.put('/:order_id', editOrder);

router.get('/:order_id', getOrderById);


module.exports = router;