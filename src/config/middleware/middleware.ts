import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import Config from '../env';
import { HttpError } from '../error';
import { sendHttpErrorModule } from '../error/send-http-error';

/**
 * @export
 * @param {express.Application} app
 */
export function configure(app: express.Application): void {
  // express middleware
  app.use(
    bodyParser.urlencoded({
      extended: false,
    })
  );
  app.use(bodyParser.json());
  // parse Cookie header and populate req.cookies with an object keyed by the cookie names.
  app.use(cookieParser());
  // returns the compression middleware
  app.use(compression());

  // helps you secure your Express apps by setting various HTTP headers
  app.use(helmet());
  app.use(morgan('dev'));

  // custom errors
  app.use(sendHttpErrorModule);

  // CORS option to whitelist domains
  // providing a Connect/Express middleware that can be used to enable COL̥RS with various options
  app.use(
    cors({
      origin: (origin, callback): void => {
        // if (!origin || Config.whitelist.indexOf(origin) !== -1) {
        callback(null, true);
        // } else {
        //   callback(new Error('Not allowed by CORS'));
        // }
      },
    })
  );

  // cors
  app.use((req: any, res: any, next: any) => {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS ');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With,' + ' Content-Type, Accept,' + ' Authorization,' + ' Access-Control-Allow-Credentials'
    );
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });
}

interface CustomResponse extends express.Response {
  sendHttpError: (error: HttpError | Error, message?: string) => void;
}

/**
 * @export
 * @param {express.Application} app
 */
export function initErrorHandler(app: express.Application): void {
  app.use((error: Error, req: express.Request, res: CustomResponse, next: express.NextFunction) => {
    if (typeof error === 'number') {
      error = new HttpError(error); // next(404)
    }

    if (error instanceof HttpError) {
      res.sendHttpError(error);
    } else {
      if (app.get('env') === 'development') {
        error = new HttpError(500, error.message);
        res.sendHttpError(error);
      } else {
        error = new HttpError(500);
        res.sendHttpError(error, error.message);
      }
    }

    console.error(error);
  });
}
