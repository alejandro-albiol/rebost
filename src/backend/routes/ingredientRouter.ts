import { Router } from 'express';
import { IngredientController } from '../controllers/IngredientController.js';

const ingredientRouter = Router();

ingredientRouter.post('/', IngredientController.registerOrFindIngredient);
ingredientRouter.get('/', IngredientController.getAllIngredients);

export default ingredientRouter;
