import Express from 'express';
import userRouter from './userRouter.js';
import userInventoryRouter from './userInventoryRouter.js';
import ingredientRouter from './ingredientRouter.js';


const apiRouter = Express.Router();

apiRouter.use("/users", userRouter);
apiRouter.use("/inventory", userInventoryRouter);
apiRouter.use("/ingredients", ingredientRouter);

export default apiRouter;