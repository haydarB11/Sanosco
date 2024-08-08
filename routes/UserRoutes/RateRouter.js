const {
	rateItem,
} = require('../../controllers/UserControllers/RateController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

router.post('/', rateItem);

module.exports = router;