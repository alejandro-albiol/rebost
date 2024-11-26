import { Router } from 'express';
import { IngredientController } from '../controllers/IngredientController.js';
import { ShoppingListController } from '../controllers/ShoppingListController.js';

const shoppingListRouter = Router();

shoppingListRouter.post('/', ShoppingListController.createShoppingList);
shoppingListRouter.post('/:shoppingListId', ShoppingListController.addIngredient);
shoppingListRouter.get('/:userId', ShoppingListController.getShoppingLists);

export default shoppingListRouter;
