import { Hono } from 'hono';
import employeesRoute from './employees';
import { validateEmployee } from 'server/middleware/auth';

const panelRoute = new Hono();
panelRoute.use('*', validateEmployee);
panelRoute.route('/employees', employeesRoute);

export default panelRoute;