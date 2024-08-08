const {
	userLogin,
	userRegister,
	editOwnAccount,
	deleteAccount,
	verifyOtp,
	sendOTP,
	resetPassword,
	getUserById,
} = require('../../controllers/UserControllers/UserController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.post('/login', userLogin);

router.post('/verify', verifyOtp);

router.get('/otp', sendOTP);

router.post('/', userRegister);

router.get('/:user_id', getUserById);

router.use(isAuth);

router.put('/', editOwnAccount);

router.post('/reset-password', resetPassword);

router.get('/', getUserById);

router.delete('/', deleteAccount);

module.exports = router;