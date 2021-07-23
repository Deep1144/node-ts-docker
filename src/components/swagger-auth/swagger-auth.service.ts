import * as jwt from 'jsonwebtoken';
import Config from '../../config/env';

import { ISwaggerAuthModel, ISwaggerTokenModel } from './swagger-auth.model';

/**
 * @export
 * @interface ISwaggerAuthService
 */
interface ISwaggerAuthService {
  /**
   * @returns {Promise<ISwaggerTokenModel>}
   * @memberof ISwaggerAuthService
   */
  swaggerLogin(credentials: ISwaggerAuthModel): Promise<ISwaggerTokenModel>;
}

const SwaggerAuthService: ISwaggerAuthService = {
  /**
   * @returns {Promise < ISwaggerTokenModel >}
   * @memberof CompanyService
   */
  async swaggerLogin(credentials: ISwaggerAuthModel): Promise<ISwaggerTokenModel> {
    try {
      if (!credentials) {
        return <any>{ message: 'Username and password are required.' };
      }
      if (!credentials.username) {
        return <any>{ message: 'Username is required.' };
      } else if (!credentials.password) {
        return <any>{ message: 'Password is required.' };
      } else if (credentials.username !== Config.swagger.username) {
        return <any>{ message: 'Enter a valid username.' };
      } else if (credentials.password !== Config.swagger.password) {
        return <any>{ message: 'Enter a valid password.' };
      }

      return <ISwaggerTokenModel>{
        token: jwt.sign({ username: credentials.username }, Config.secret, { expiresIn: '1500m' }),
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

export { ISwaggerAuthService, SwaggerAuthService };
