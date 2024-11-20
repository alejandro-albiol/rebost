import Express from 'express';
import path from 'path';
import { publicPath } from '../configuration/config.js';

const staticRouter = Express.Router();

staticRouter.get('/register', (req: Express.Request, res: Express.Response) => {
    const targetFilePath = path.join(publicPath, "/register.html");
    res.sendFile(targetFilePath);
})

export {staticRouter};