import AuthService from './auth.service';
import HttpError from '../../config/error';
import { IMembersModel } from '../member/member.model';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import app from '../../config/server/server';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user: IMembersModel = await AuthService.getUser(req.body);

    const tokenInfo = {
      _id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    const token: string = jwt.sign(tokenInfo, app.get('secret'), {
      expiresIn: '1500m',
    });

    res.json({
      status: 200,
      logged: true,
      token: token,
      message: 'Sign in successfull',
    });
  } catch (error) {
    if (error.message.toLowerCase().includes('invalid')) {
      error.status = 401;
    }
    return next(new HttpError(error.status, error.message));
  }
}
