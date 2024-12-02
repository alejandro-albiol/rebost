import express from 'express';
import { UserInventoryController } from '../controllers/UserInventoryController.js';

const userInventoryRouter = express.Router();

userInventoryRouter.post('/', UserInventoryController.addIngredient);
userInventoryRouter.get('/:userId', UserInventoryController.getInventory);
userInventoryRouter.put('/', UserInventoryController.updateIngredientQuantity);

export default userInventoryRouter;
