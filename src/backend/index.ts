import express from 'express';
import apiRouter from './routes/apiRouter.js';
import { publicPath } from './configuration/config.js';
import { staticRouter } from './routes/staticRouter.js';

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.use(express.static(publicPath));

app.use("/", staticRouter);
app.use("/api/v1/", apiRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
