import { ACTIONS, ADMINPANELROLES, RESOURCE } from '../../constants/constant';
import { NextFunction, Response } from 'express';
import { accessControl } from '../../common/access-control';
import { RequestWithMeta } from '../../constants/types';
import HttpError from '../error';

export const grant = function (action: ACTIONS, resource: RESOURCE) {
  return async (req: RequestWithMeta, res: Response, next: NextFunction) => {
    try {
      const permission = can(req.user.role, action, resource);
      if (!permission.granted) {
        throw new HttpError(401, "You don't have enough permission to perform this action");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

const can = (role: ADMINPANELROLES, action: ACTIONS, resource: RESOURCE) => {
  const obj = {
    [ACTIONS.READ]: accessControl.can(role).read(resource),
    [ACTIONS.DELETE]: accessControl.can(role).delete(resource),
    [ACTIONS.CREATE]: accessControl.can(role).create(resource),
    [ACTIONS.UPDATE]: accessControl.can(role).update(resource),
  };
  return obj[action];
};
