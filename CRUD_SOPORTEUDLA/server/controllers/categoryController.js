import * as categoryService from '../services/categoryService.js';

// Crear Categoría
export const createCategory = async (req, res) => {
  const { nombre } = req.body;
  try {
    const newCategory = await categoryService.createCategory(nombre);
    res.status(201).json({ message: 'Categoría creada exitosamente', category: newCategory });
  } catch (error) {
    console.error("Error al crear la categoría:", error);
    res.status(500).json({ error: 'Error al crear la categoría' });
  }
};

// Obtener Categorías
export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ message: 'Error al obtener categorías' });
  }
};

// Obtener Subcategorías por Categoría
export const getSubcategories = async (req, res) => {
  const { categoria_id } = req.query;

  try {
    if (!categoria_id) {
      return res.status(400).json({ error: 'El parámetro categoria_id es obligatorio' });
    }

    const subcategories = await categoryService.getSubcategoriesByCategoryId(categoria_id);
    res.status(200).json(subcategories);
  } catch (error) {
    console.error('Error al obtener subcategorías:', error);
    res.status(500).json({ error: 'Error al obtener subcategorías' });
  }
};

// Actualizar Subcategoría
export const updateSubcategory = async (req, res) => {
  const { id } = req.params;
  const { nombre, tiempo_estimado } = req.body;

  try {
    const updatedSubcategory = await categoryService.updateSubcategory(id, { nombre, tiempo_estimado });
    res.status(200).json({ message: 'Subcategoría actualizada exitosamente', subcategory: updatedSubcategory });
  } catch (error) {
    console.error("Error al actualizar la subcategoría:", error);
    if (error.message === 'Subcategoría no encontrada') {
      res.status(404).json({ error: 'Subcategoría no encontrada' });
    } else {
      res.status(500).json({ error: 'Error al actualizar la subcategoría' });
    }
  }
};
