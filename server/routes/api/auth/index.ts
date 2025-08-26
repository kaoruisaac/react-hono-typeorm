import { Hono } from 'hono';
import authPanelRoute from './panel';

const authRoute = new Hono();

authRoute.route('/panel', authPanelRoute);

export default authRoute;