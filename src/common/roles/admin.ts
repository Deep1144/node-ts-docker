import { ADMINPANELROLES, RESOURCE } from '../../constants/constant';

export const adminAccess = {
  [ADMINPANELROLES.ADMIN]: {
    [RESOURCE.MEMBERS]: {
      'read:any': ['*'],
      'update:any': ['*'],
    },
  },
};
