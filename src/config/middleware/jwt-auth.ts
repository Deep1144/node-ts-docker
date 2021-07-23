import * as jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import app from '../server/server';
import HttpError from '../error';
import * as http from 'http';
import MemberModel from '../../components/member/member.model';

export interface RequestWithUser extends Request {
  user: object | string;
}

/**
 *
 * @param {RequestWithUser} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void}
 * @swagger
 *  components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: authorization
 */
export async function isAuthenticated(req: RequestWithUser, res: Response, next: NextFunction) {
  const authorization: any = req.headers['authorization'];
  if (!authorization) {
    return next(new HttpError(401, 'No token provided'));
  }
  const [authType, token] = authorization.split(' ');
  if (token) {
    try {
      const payload: any = jwt.verify(token, app.get('secret'));
      const user = await MemberModel.findById(payload._id).select('-password').lean();
      if (!user) {
        throw new Error('');
      }
      req.user = user;
      return next();
    } catch (error) {
      return next(new HttpError(401, http.STATUS_CODES[401]));
    }
  }

  return next(new HttpError(401, 'No token provided'));
}

export const fnSignToken = () => {};
