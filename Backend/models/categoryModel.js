import { db } from '../config/db.js';

export const createCategory = async ({ category_name, category_sequence, status, image }) => {
    const connection = await db();
    const [result] = await connection.execute(`
        INSERT INTO categories (category_name, category_sequence, status, image)
        VALUES (?, ?, ?, ?)
    `, [category_name, category_sequence, status, image]);
    return result.insertId;
};

export const getCategories = async () => {
    const connection = await db();
    const [rows] = await connection.query('SELECT * FROM categories');
    return rows;
};

export const getCategoryById = async (id) => {
    const connection = await db();
    const [rows] = await connection.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0];
};

export const updateCategory = async (id, { category_name, category_sequence, status, image }) => {
    const connection = await db();
    const [result] = await connection.execute(`
        UPDATE categories 
        SET category_name = ?, category_sequence = ?, status = ?, image = ? 
        WHERE id = ?
    `, [category_name, category_sequence, status, image, id]);
    return result.affectedRows > 0;
};

export const deleteCategory = async (id) => {
    const connection = await db();
    const [result] = await connection.execute(`
        DELETE FROM categories WHERE id = ?
    `, [id]);
    return result.affectedRows > 0;
};