const {
	addCategory,
	editCategory,
	deleteCategory,
	getAllCategories,
	addQuestionWithAnswersFromExcelFile
} = require('../../controllers/ManagerControllers/CategoryController');
const { getAllItemsForOneCategory } = require('../../controllers/ManagerControllers/ItemController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');
const { uploadCategory } = require('../../utils/uploadFiles/uploadDestinations');

router.use(isAuth);

router.post('/', uploadCategory.single('image'), addCategory);

router.put('/:category_id', uploadCategory.single('image'), editCategory);

router.delete('/:category_id', deleteCategory);

router.get('/', getAllCategories);

router.get('/:category_id/items', getAllItemsForOneCategory);

router.post('/excel', uploadCategory.single('file'), addQuestionWithAnswersFromExcelFile);


module.exports = router;