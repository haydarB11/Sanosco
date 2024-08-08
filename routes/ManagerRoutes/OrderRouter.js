const {
	editOrder,
	deleteOrder,
	getAllOrders,
} = require('../../controllers/ManagerControllers/OrderController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

router.put('/:order_id', editOrder);

router.delete('/:order_id', deleteOrder);

router.get('/', getAllOrders);

module.exports = router;