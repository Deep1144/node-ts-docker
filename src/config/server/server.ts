import * as express from 'express';
import * as Routes from '../../routes';
import * as Middleware from '../middleware/middleware';
import Config from './../env';

/**
 * @constant {express.Application}
 */
const app: express.Application = express();

/**
 * @constructs express.Application Middleware
 */
Middleware.configure(app);

/**
 * @constructs express.Application Routes
 */
Routes.init(app);

/**
 * @constructs express.Application Error Handler
 */
Middleware.initErrorHandler(app);

/**
 * sets port 3000 to default or unless otherwise specified in the environment
 */
app.set('port', Config.port || 3001);
/**
 * sets host localhost to default or unless otherwise specified in the environment
 */
app.set('host', Config.host || 'localhost');

/**
 * sets secret to 'superSecret', otherwise specified in the environment
 */
app.set('secret', Config.secret || 'superSecret');

/**
 * @exports {express.Application}
 */
export default app;
