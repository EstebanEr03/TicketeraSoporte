import Category from '../models/categoryModel.js';
import Subcategory from '../models/subcategoryModel.js';

// Operaciones relacionadas con categorías
export const create = async (nombre) => {
  return await Category.create({ nombre });
};

export const findAllCategories = async () => {
  return await Category.findAll();
};

// Operaciones relacionadas con subcategorías
export const findAllSubcategoriesByCategoryId = async (categoria_id) => {
  return await Subcategory.findAll({
    where: { categoria_id },
  });
};

export const findSubcategoryById = async (id) => {
  return await Subcategory.findByPk(id);
};

export const saveSubcategory = async (subcategory) => {
  return await subcategory.save();
};
