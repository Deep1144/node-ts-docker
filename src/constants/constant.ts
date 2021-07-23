export const SERVERURI = 'http://server.com';
export const jwtSecret = 'test secret';
export const BUCKETNAME = 'deep-patel';

export enum ADMINPANELROLES {
  'SUPER_ADMIN' = 'SUPER_ADMIN',
  'ADMIN' = 'ADMIN',
}

export const DEFAULT_LIMIT = 10;
export const DEFAULT_PAGE = 1;

export enum ACTIONS {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  READ = 'READ',
}

/**
 * @description - it includes all the routes (EG : /user = resource user)
 * Using it to check permission to perform actions by different roles
 */
export enum RESOURCE {
  MEMBERS = 'MEMBERS',
}
