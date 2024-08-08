const {
	sendNotification,
} = require('../../controllers/ManagerControllers/NotificationController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

router.post('/', sendNotification);

module.exports = router;