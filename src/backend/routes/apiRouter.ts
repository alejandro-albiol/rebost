import Express from 'express';
import userRouter from './userRouter.js';
import userInventoryRouter from './userInventoryRouter.js';
import ingredientRouter from './ingredientRouter.js';
import shoppingListRouter from './shoppingListsRouter.js';


const apiRouter = Express.Router();

apiRouter.use("/users", userRouter);
apiRouter.use("/inventory", userInventoryRouter);
apiRouter.use("/ingredients", ingredientRouter);
apiRouter.use("/shoppinglists", shoppingListRouter)

export default apiRouter;