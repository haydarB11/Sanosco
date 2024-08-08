const {
	addBrand,
	editBrand,
	deleteBrand,
	getAllBrands,
} = require('../../controllers/ManagerControllers/BrandController');
const { getAllItemsForOneBrand } = require('../../controllers/ManagerControllers/ItemController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');
const { uploadBrand } = require('../../utils/uploadFiles/uploadDestinations')

router.use(isAuth);

router.post('/', uploadBrand.single('image'), addBrand);

router.put('/:brand_id', uploadBrand.single('image'), editBrand);

router.delete('/:brand_id', deleteBrand);

router.get('/', getAllBrands);

router.get('/:brand_id/items', getAllItemsForOneBrand);

module.exports = router;