import { db } from '../config/db.js';

export const createSubCategory = async ({ subcategory_name, category_id, sub_category_sequence, status, image }) => {
    const connection = await db();
    const [result] = await connection.execute(`
        INSERT INTO sub_categories (subcategory_name, category_id, sub_category_sequence, status, image)
        VALUES (?, ?, ?, ?, ?)
    `, [subcategory_name, category_id, sub_category_sequence, status, image]);
    return result.insertId;
};

export const fetchAllSubCategories = async () => {
    const connection = await db();
    const [rows] = await connection.query('SELECT * FROM sub_categories');
    return rows;
};


export const getSubCategoriesByCategoryId = async (category_id) => {
    const connection = await db();
    const [rows] = await connection.query('SELECT * FROM sub_categories WHERE category_id = ?', [category_id]);
    return rows;
};

export const getSubCategoryById = async (id) => {
    const connection = await db();
    const [rows] = await connection.query('SELECT * FROM sub_categories WHERE id = ?', [id]);
    return rows[0];
};

export const updateSubCategory = async (id, { subcategory_name, category_id, sub_category_sequence, status, image }) => {
    const connection = await db();
    const [result] = await connection.execute(`
        UPDATE sub_categories 
        SET subcategory_name = ?, category_id = ?, sub_category_sequence = ?, status = ?, image = ? 
        WHERE id = ?
    `, [subcategory_name, category_id, sub_category_sequence, status, image, id]);
    return result.affectedRows > 0;
};

export const deleteSubCategory = async (id) => {
    const connection = await db();
    const [result] = await connection.execute(`
        DELETE FROM sub_categories WHERE id = ?
    `, [id]);
    return result.affectedRows > 0;
};