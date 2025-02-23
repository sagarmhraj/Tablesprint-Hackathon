import { Router } from 'express';
import { addSubCategory, getSubCategories, editSubCategory, deleteSubCategorys, getAllSubCategories } from '../controllers/subCategoryController.js';
import upload from '../middleware/uploadFile.js';
import auth from '../middleware/auth.js';

const subCategoryRouter = Router();

subCategoryRouter.post('/add', auth, upload.single('image'), addSubCategory);
subCategoryRouter.get('/', auth, getAllSubCategories);
subCategoryRouter.get('/:category_id', auth, getSubCategories);
subCategoryRouter.put('/edit/:id', auth, upload.single('image'), editSubCategory);
subCategoryRouter.delete('/delete/:id', auth, deleteSubCategorys);

export default subCategoryRouter;