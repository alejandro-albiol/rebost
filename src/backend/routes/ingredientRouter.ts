import { Router } from 'express';
import { IngredientController } from '../controllers/IngredientController.js';

const ingredientRouter = Router();

ingredientRouter.post('/', IngredientController.registerIngredient);
ingredientRouter.get('/', IngredientController.getAllIngredients);

export default ingredientRouter;
