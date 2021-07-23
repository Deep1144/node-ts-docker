import { AccessControl } from 'accesscontrol';
import { superAdminAccess } from './roles/super-admin';
import { adminAccess } from './roles/admin';

const grantObjects = {
  ...superAdminAccess,
  ...adminAccess,
};

export const accessControl = new AccessControl(grantObjects);
