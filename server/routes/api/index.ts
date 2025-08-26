import { Hono } from 'hono';
import sampleRoute from './sample';
import authRoute from './auth';
import panelRoute from './panel';

const apiRoute = new Hono();

apiRoute.route('/sample', sampleRoute);
apiRoute.route('/auth', authRoute);
apiRoute.route('/panel', panelRoute);

export default apiRoute;