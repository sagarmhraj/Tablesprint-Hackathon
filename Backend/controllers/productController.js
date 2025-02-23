import { createProduct, getProductsBySubCategoryId, updateProduct, deleteProduct, getProductById, fetchAllProducts } from '../models/productModel.js';
import asyncHandler from 'express-async-handler';

export const addProduct = asyncHandler(async (req, res) => {
    const { product_name, sub_category_id, category_id, status } = req.body;
    const image = req.file.path;

    const productId = await createProduct({ product_name, sub_category_id, category_id, status, image });

    res.status(201).json({
        status: "success",
        data: {
            id: productId,
            product_name,
            sub_category_id,
            category_id,
            status,
            image,
        },
    });
});


//fetch all products
export const getAllProducts = asyncHandler(async (req, res) => {
    const products = await fetchAllProducts();
    
    res.status(200).json({
        status: "success",
        data: products,
    });
});

//fetch products by subcategory id
export const getProducts = asyncHandler(async (req, res) => {
    const { sub_category_id } = req.params;
    const products = await getProductsBySubCategoryId(sub_category_id);

    res.status(200).json({
        status: "success",
        data: products,
    });
});

export const editProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { product_name, sub_category_id, category_id, status } = req.body;
    const image = req.file?.path;

    const existingProduct = await getProductById(id);

    if (!existingProduct) {
        res.status(404).json({ status: 'fail', message: 'Product not found' });
        return;
    }

    const updatedProduct = {
        product_name: product_name || existingProduct.product_name,
        sub_category_id: sub_category_id || existingProduct.sub_category_id,
        category_id: category_id || existingProduct.category_id,
        status: status || existingProduct.status,
        image: image || existingProduct.image,
    };

    await updateProduct(id, updatedProduct);

    res.status(200).json({
        status: 'success',
        data: updatedProduct,
    });
});

export const deleteProducts = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const success = await deleteProduct(id);

    if (success) {
        res.status(200).json({
            status: "success",
            message: "Product deleted successfully",
        });
    } else {
        res.status(404).json({
            status: "fail",
            message: "Product not found",
        });
    }
});