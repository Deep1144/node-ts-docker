import { Router } from 'express';
import { SwaggerAuthComponent } from '..';

/**
 * @constant {express.Router}
 */
const router: Router = Router();

/**
 * POST method route
 * @example http://localhost:port/swagger-auth/login
 *
 * @swagger
 * /swagger-auth/login:
 *   post:
 *      description: Swagger documentation authentication.
 *      tags: ["Swagger Auth"]
 *      operationId: swaggerLogin
 *      security:
 *       - ApiKeyAuth: []
 *      requestBody:
 *        description: Swagger documentation authentication.
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SwaggerAuth'
 *            example:
 *              username: username
 *              password: password
 *      responses:
 *        201:
 *          description: Return token for access swagger documentation
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SwaggerToken'
 *        default:
 *          description: Unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */
router.post('/login', SwaggerAuthComponent.swaggerLogin);

export default router;
