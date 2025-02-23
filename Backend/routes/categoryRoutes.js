import { Router } from 'express';
import { addCategory, getCategory, editCategory, deleteCategorys } from '../controllers/categoryController.js';
import upload from '../middleware/uploadFile.js';
import auth from '../middleware/auth.js';

const categoryRouter = Router();

categoryRouter.post('/add', auth, upload.single('image'), addCategory);
categoryRouter.get('/', auth, getCategory);
categoryRouter.put('/edit/:id', auth, upload.single('image'), editCategory);
categoryRouter.delete('/delete/:id', auth, deleteCategorys);

export default categoryRouter;