import { Router } from 'express';
import { addProduct, getProducts, editProduct, deleteProducts, getAllProducts } from '../controllers/productController.js';
import upload from '../middleware/uploadFile.js';
import auth from '../middleware/auth.js';

const productRouter = Router();

productRouter.post('/add', auth, upload.single('image'), addProduct);
productRouter.get('/', auth, getAllProducts);
productRouter.get('/:sub_category_id', auth, getProducts);
productRouter.put('/edit/:id', auth, upload.single('image'), editProduct);
productRouter.delete('/delete/:id', auth, deleteProducts);

export default productRouter;