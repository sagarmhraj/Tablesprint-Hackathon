import { createCategory, getCategories, updateCategory, deleteCategory, getCategoryById } from '../models/categoryModel.js';
import asyncHandler from 'express-async-handler';

export const addCategory = asyncHandler(async (req, res) => {
    const { category_name, category_sequence, status } = req.body;
    const image = req.file.path;

    // Fetch existing categories to find the next ID
    const existingCategories = await getCategories();
    const existingIds = existingCategories.map(category => category.id);

    // Find the next available ID
    let newCategoryId = 1;
    while (existingIds.includes(newCategoryId)) {
        newCategoryId++;
    }

    // Create new category with the new ID
    const categoryId = await createCategory({
        id: newCategoryId,  // Pass the new ID to your createCategory function
        category_name,
        category_sequence,
        status,
        image
    });

    res.status(201).json({
        status: "success",
        data: {
            id: categoryId,  // Make sure this returns the correct ID if your createCategory function generates it
            category_name,
            category_sequence,
            status,
            image,
        },
    });
});

export const getCategory = asyncHandler(async (req, res) => {
    const categories = await getCategories();

    res.status(200).json({
        status: "success",
        data: categories,
    });
});

export const editCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { category_name, category_sequence, status } = req.body;
    let image;

    const existingCategory = await getCategoryById(id);


    if (!existingCategory) {
        return res.status(404).json({
            status: "fail",
            message: "Category not found",
        });
    }

    if (req.file) {
        image = req.file.path;
    } else {
        image = existingCategory.image;
    }

    const updateCategory = (req, res) => {
        const { id, newValue } = req.body; // Assuming you're sending id and newValue in the request body

        // Check if ID exists
        db.query("SELECT * FROM your_table_name WHERE id = ?", [id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Database error" });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: "ID not found" });
            }

            // Update the ID
            db.query("UPDATE your_table_name SET column_name = ? WHERE id = ?", [newValue, id], (err) => {
                if (err) {
                    return res.status(500).json({ error: "Failed to update" });
                }
                res.status(200).json({ message: "ID updated successfully" });
            });
        });
    };


    await updateCategory(id, updatedCategory);

    res.status(200).json({
        status: "success",
        data: updatedCategory,
    });
});

export const deleteCategorys = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const success = await deleteCategory(id);

    if (success) {
        res.status(200).json({
            status: "success",
            message: "Category deleted successfully",
        });
    } else {
        res.status(404).json({
            status: "fail",
            message: "Category not found",
        });
    }
});