import express from 'express';
import {
  createCategory,
  getAllCategories,
  getSubcategories,
  updateSubcategory,
} from '../controllers/categoryController.js';

const router = express.Router();

// Rutas de categorías y subcategorías
router.post('/create', createCategory);
router.get('/all', getAllCategories);
router.get('/subcategories', getSubcategories); // Endpoint para obtener subcategorías filtradas
router.put('/subcategories/:id', updateSubcategory);

export default router;
