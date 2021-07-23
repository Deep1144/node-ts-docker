import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import Config from '../env';

import app from '../server/server';

interface RequestWithUser extends Request {
  user: object | string;
}

export async function isSwaggerAuthenticated(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
  const { token }: any = req.query;

  const redirect: any = (): any => {
    res.writeHead(302, { Location: '/swagger-login-page' });

    return res.end();
  };

  if (token) {
    try {
      const user: any = jwt.verify(token, app.get('secret'));

      if (user && user.username === Config.swagger.username) {
        return next();
      }

      return redirect();
    } catch (error) {
      return redirect();
    }
  }

  return redirect();
}
