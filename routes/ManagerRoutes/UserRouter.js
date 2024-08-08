const {
	managerLogin,
	editUser,
	editOwnAccount,
	deleteUser,
	addUser,
	getAllUsers,
	getMyOwnAccount,
} = require('../../controllers/ManagerControllers/UserController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.post('/login', managerLogin);

router.use(isAuth);

router.put('/edit', editOwnAccount);

router.get('/', getMyOwnAccount);

router.put('/edit', editOwnAccount);

router.post('/users/', addUser);

router.put('/users/edit', editOwnAccount);

router.put('/users/:user_id', editUser);

router.delete('/users/:user_id', deleteUser);

router.get('/users/', getAllUsers);

module.exports = router;