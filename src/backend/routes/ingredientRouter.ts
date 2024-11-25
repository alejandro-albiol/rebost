import { Router } from 'express';
import { IngredientController } from '../controllers/IngredientController.js';

const ingredientRouter = Router();

ingredientRouter.post('/', IngredientController.create);
ingredientRouter.get('/', IngredientController.getAll);

export default ingredientRouter;
