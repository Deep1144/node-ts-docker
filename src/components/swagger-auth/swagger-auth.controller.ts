import { NextFunction, Request, Response } from 'express';
import { catchError } from '../../common/common-functions';
import { SwaggerAuthService } from './swagger-auth.service';

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function swaggerLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { username, password }: any = req.body;
    const token: any = await SwaggerAuthService.swaggerLogin({ username, password });

    res.status(200).json(token);
  } catch (error) {
    catchError(error, res, next);
  }
}
