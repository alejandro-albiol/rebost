import Express from 'express';
import userRouter from './userRouter.js';
import userInventoryRouter from './userInventoryRouter.js';
import ingredientRouter from './ingredientRouter.js';
import shoppingListRouter from './shoppingListsRouter.js';
import recipeGeneratorRouter from './recipeGeneratorRouter.js';

const apiRouter = Express.Router();
apiRouter.use(Express.json());

apiRouter.use("/users", userRouter);
apiRouter.use("/inventory", userInventoryRouter);
apiRouter.use("/ingredients", ingredientRouter);
apiRouter.use("/shoppinglists", shoppingListRouter);
apiRouter.use("/recipes", recipeGeneratorRouter);

export default apiRouter;