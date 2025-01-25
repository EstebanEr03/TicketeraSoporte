import * as categoryRepository from '../repositories/categoryRepository.js';

export const createCategory = async (nombre) => {
  return await categoryRepository.create(nombre);
};

export const getAllCategories = async () => {
  return await categoryRepository.findAllCategories();
};

export const getSubcategoriesByCategoryId = async (categoria_id) => {
  return await categoryRepository.findAllSubcategoriesByCategoryId(categoria_id);
};

export const updateSubcategory = async (id, { nombre, tiempo_estimado }) => {
  const subcategory = await categoryRepository.findSubcategoryById(id);
  if (!subcategory) {
    throw new Error('Subcategoría no encontrada');
  }
  subcategory.nombre = nombre;
  subcategory.tiempo_estimado = tiempo_estimado;
  return await categoryRepository.saveSubcategory(subcategory);
};
