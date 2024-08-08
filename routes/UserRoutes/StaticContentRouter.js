const {
	getStaticContentDependingOnTitle,
	getAllContactStaticContent,
} = require('../../controllers/UserControllers/StaticContentController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

// router.use(isAuth);

router.get('/', getStaticContentDependingOnTitle);

router.get('/contact', getAllContactStaticContent);

module.exports = router;