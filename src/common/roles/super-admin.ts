import { ADMINPANELROLES, RESOURCE } from '../../constants/constant';

export const superAdminAccess = {
  [ADMINPANELROLES.SUPER_ADMIN]: {
    [RESOURCE.MEMBERS]: {
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
      'create:any': ['*'],
    },
  },
};
