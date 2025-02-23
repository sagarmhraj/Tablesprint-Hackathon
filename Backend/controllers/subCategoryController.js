import { createSubCategory, getSubCategoriesByCategoryId, updateSubCategory, deleteSubCategory, getSubCategoryById, fetchAllSubCategories } from '../models/subCategoryModel.js';
import asyncHandler from 'express-async-handler';

export const addSubCategory = asyncHandler(async (req, res) => {
    const { subcategory_name, category_id, sub_category_sequence, status } = req.body;
    const image = req.file.path;

    const subCategoryId = await createSubCategory({ subcategory_name, category_id, sub_category_sequence, status, image });

    res.status(201).json({
        status: "success",
        data: {
            id: subCategoryId,
            subcategory_name,
            category_id,
            sub_category_sequence,
            status,
            image,
        },
    });
});

//fetch all subcategories
export const getAllSubCategories = asyncHandler(async (req, res) => {
    const subCategories = await fetchAllSubCategories();
    
    res.status(200).json({
        status: "success",
        data: subCategories,
    });
});

//fetch subcategories by category id
export const getSubCategories = asyncHandler(async (req, res) => {
    const { category_id } = req.params;
    const subCategories = await getSubCategoriesByCategoryId(category_id);

    res.status(200).json({
        status: "success",
        data: subCategories,
    });
});

export const editSubCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { subcategory_name, category_id, sub_category_sequence, status } = req.body;
    const image = req.file?.path;

    const existingSubCategory = await getSubCategoryById(id);
    // console.log(existingSubCategory);
    

    if (!existingSubCategory) {
        res.status(404).json({ status: 'fail', message: 'Subcategory not found' });
        return;
    }

    const updatedSubCategory = {
        subcategory_name: subcategory_name || existingSubCategory.subcategory_name,
        category_id: category_id || existingSubCategory.category_id,
        sub_category_sequence: sub_category_sequence || existingSubCategory.sub_category_sequence,
        status: status || existingSubCategory.status,
        image: image || existingSubCategory.image,
    };

    await updateSubCategory(id, updatedSubCategory);

    res.status(200).json({
        status: 'success',
        data: updatedSubCategory,
    });
});


export const deleteSubCategorys = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const success = await deleteSubCategory(id);

    if (success) {
        res.status(200).json({
            status: "success",
            message: "Subcategory deleted successfully",
        });
    } else {
        res.status(404).json({
            status: "fail",
            message: "Subcategory not found",
        });
    }
});