import express, { Router } from 'express';
import { RecipeGeneratorController } from '../controllers/RecipeGeneratorController.js';

const recipeGeneratorRouter: Router = express.Router();

recipeGeneratorRouter.post('/generate', RecipeGeneratorController.generateRecipes);

export default recipeGeneratorRouter;
