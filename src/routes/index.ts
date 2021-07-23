import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import * as jwtConfig from '../config/middleware/jwt-auth';
import * as swaggerUi from 'swagger-ui-express';
import AuthRouter from './../components/auth/auth.router';
import MemberRouter from '../components/member/member.router';
import UploadRouter from '../components/upload/upload.route';
import { swaggerSpec } from '../config/swagger/swagger';
import SwaggerAuthRouter from '../components/swagger-auth/swagger-auth-router';
import * as jwtSwagger from '../config/middleware/jwt-swagger-auth';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { CaptureConsole } from '@sentry/integrations';

/**
 * @export
 * @param {express.Application} app
 */
export function init(app: express.Application): void {
  Sentry.init({
    dsn: 'https://916ef051911a4bf4ab75d1ed85b3298f@o718334.ingest.sentry.io/5794026',
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app }),
      new CaptureConsole({
        levels: ['error'],
      }),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });

  // RequestHandler creates a separate execution context using domains, so that every
  // transaction/span/breadcrumb is attached to its own Hub instance
  app.use(Sentry.Handlers.requestHandler());
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());

  const router: express.Router = express.Router();

  app.get('/', (_, res) => {
    res.status(200).send('API is up and running');
  });
  /**
   * @description Forwards any requests to the /auth URI to our AuthRouter
   * @constructs
   */
  app.use('/auth', AuthRouter);
  app.use('/upload', UploadRouter);
  app.use('/api/members', jwtConfig.isAuthenticated, MemberRouter);

  /**
   * @description
   *  If swagger.json file exists in root folder, shows swagger api description
   *  else send commands, how to get swagger.json file
   * @constructs
   */
  app.use('/docs', swaggerUi.serve);
  app.get('/docs', jwtSwagger.isSwaggerAuthenticated, swaggerUi.setup(swaggerSpec));
  app.get('/swagger-login-page', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/swagger-login.html'));
  });
  app.use('/swagger-auth', SwaggerAuthRouter);
  app.get('/swagger', jwtSwagger.isSwaggerAuthenticated, (req: any, res: any) => {
    res.header('Content-Type', 'application/json');
    res.json(swaggerSpec);
  });

  app.use(Sentry.Handlers.errorHandler());

  /**
   * @description No results returned mean the object is not found
   * @constructs
   */
  app.use((req, res, next) => {
    res.status(404).send(http.STATUS_CODES[404]);
  });

  /**
   * @constructs all routes
   */
  app.use(router);
}
