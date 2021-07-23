/**
 * @swagger
 * components:
 *  schemas:
 *    SwaggerAuth:
 *      properties:
 *        username:
 *          type: string
 *        password:
 *          type: string
 */
interface ISwaggerAuthModel {
  username: string;
  password: string;
}

/**
 * @swagger
 * components:
 *  schemas:
 *    SwaggerToken:
 *      properties:
 *        token:
 *          type: string
 */
interface ISwaggerTokenModel {
  token?: string;
}

export { ISwaggerAuthModel, ISwaggerTokenModel };
