import { AuthComponent } from '..';
import { Router } from 'express';

const router: Router = Router();

/**
 * POST method route
 * @example http://localhost:PORT/login
 *
 * @swagger
 * /auth/login/:
 *  post:
 *    description: Login user to application
 *    tags: ["auth"]
 *    requestBody:
 *      description: login body
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/MemberSchema'
 *          example:
 *            email: admin@gmail.com
 *            password: Admin123
 *    responses:
 *      200:
 *        description: user successfuly logged
 *        content:
 *          appication/json:
 *            example:
 *              status: 200
 *              logged: true
 *              message: Successfully logged!
 *      401:
 *        description: Not logged, invalid credentials
 *        content:
 *          application/json:
 *            example:
 *              status: 401
 *              logged: false
 *              message: Invalid credentials
 */
router.post('/login', AuthComponent.login);

export default router;
