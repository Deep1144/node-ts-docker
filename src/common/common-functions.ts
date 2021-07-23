import { NextFunction, Response } from 'express';
import HttpError from '../config/error';

export const catchError: any = (error: any, res: Response, next: NextFunction): void => {
  if (error.code) {
    res.status(error.code).json({
      message: error.message,
    });
  } else {
    next(new HttpError(error.message.status, error.message));
  }
};
