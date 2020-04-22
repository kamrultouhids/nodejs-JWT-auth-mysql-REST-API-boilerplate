import { Router } from 'express';
import apiRoute from './api.route';

const routes = Router();

routes.use('/', apiRoute);

export default routes;
