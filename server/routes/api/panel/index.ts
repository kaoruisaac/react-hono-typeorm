import { Hono } from 'hono';
import employeesRoute from './employees';

const panelRoute = new Hono();

panelRoute.route('/employees', employeesRoute);

export default panelRoute;