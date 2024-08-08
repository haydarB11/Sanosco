const {
	getAllCharts,
} = require('../../controllers/ManagerControllers/ChartController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

router.get('/', getAllCharts);

module.exports = router;