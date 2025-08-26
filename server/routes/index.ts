import { Hono } from 'hono';
import apiRoute from './api';

const routes = new Hono();

routes.get('/health-check', (c) => c.json({ status: 'ok' }));
routes.route('/api', apiRoute);

export default routes;