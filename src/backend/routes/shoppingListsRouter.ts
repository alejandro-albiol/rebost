import { Router } from 'express';
import { ShoppingListController } from '../controllers/ShoppingListController.js';

const shoppingListRouter = Router();

shoppingListRouter.post('/', ShoppingListController.createShoppingList);
shoppingListRouter.post('/:shoppingListId', ShoppingListController.addIngredient);
shoppingListRouter.get('/:userId', ShoppingListController.getShoppingLists);
shoppingListRouter.patch('/:itemId', ShoppingListController.togglePurchased);

export default shoppingListRouter;
