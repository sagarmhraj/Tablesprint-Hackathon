import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {db} from './config/db.js';
import globalErrorHandler from './middleware/globalErrorHandler.js';
import userRouter from './routes/userRoutes.js';
import categoryRouter from './routes/categoryRoutes.js';
import subCategoryRouter from './routes/subCategoryRoutes.js';
import productRouter from './routes/productRoutes.js';

dotenv.config();    

db()

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.use("/api/v1/user",userRouter)
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/subcategory", subCategoryRouter);
app.use("/api/v1/product", productRouter);

app.all('*', (req, res, next) => {
    let err = new Error(`Page not found ${req.originalUrl}!`);
    err.statusCode = 404;
    next(err);
});


app.use(globalErrorHandler);

export default app;