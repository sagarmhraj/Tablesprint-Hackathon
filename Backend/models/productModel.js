import { db } from '../config/db.js';

export const createProduct = async ({ product_name, sub_category_id, category_id, status, image }) => {
    const connection = await db();
    const [result] = await connection.execute(`
        INSERT INTO products (product_name, sub_category_id, category_id, status, image)
        VALUES (?, ?, ?, ?, ?)
    `, [product_name, sub_category_id, category_id, status, image]);
    return result.insertId;
};

export const fetchAllProducts = async () => {
    const connection = await db();
    const [rows] = await connection.query('SELECT * FROM products');
    return rows;
};

export const getProductsBySubCategoryId = async (sub_category_id) => {
    const connection = await db();
    const [rows] = await connection.query('SELECT * FROM products WHERE sub_category_id = ?', [sub_category_id]);
    return rows;
};

export const getProductById = async (id) => {
    const connection = await db();
    const [rows] = await connection.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
};

export const updateProduct = async (id, { product_name, sub_category_id, category_id, status, image }) => {
    const connection = await db();
    const [result] = await connection.execute(`
        UPDATE products 
        SET product_name = ?, sub_category_id = ?, category_id = ?, status = ?, image = ? 
        WHERE id = ?
    `, [product_name, sub_category_id, category_id, status, image, id]);
    return result.affectedRows > 0;
};

export const deleteProduct = async (id) => {
    const connection = await db();
    const [result] = await connection.execute(`
        DELETE FROM products WHERE id = ?
    `, [id]);
    return result.affectedRows > 0;
};