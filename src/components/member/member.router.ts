import { Router } from 'express';
import { MemberComponent } from '..';
import { grant } from '../../config/middleware/grant';
import { isAuthenticated } from '../../config/middleware/jwt-auth';
import pagination from '../../config/middleware/pagination';
import { ACTIONS, RESOURCE } from '../../constants/constant';

/**
 * @constant {express.Router}
 */
const router: Router = Router();

/**
 * GET method route
 * @example http://localhost:PORT/api/members
 *
 * @swagger
 * /api/members:
 *   get:
 *     description: Get all stored members in Database
 *     tags: ["members"]
 *     security:
 *      - ApiKeyAuth: []
 *     parameters:
 *      - $ref: '#/components/parameters/pageParam'
 *      - $ref: '#/components/parameters/limitParam'
 *      - $ref: '#/components/parameters/filterParams'
 *      - $ref: '#/components/parameters/sortParams'
 *      - $ref: '#/components/parameters/orderParams'
 *     responses:
 *       200:
 *         description: An array of members
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                - $ref: '#/components/schemas/MemberSchema'
 *       default:
 *          description: unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */
router.get('/', isAuthenticated, pagination, grant(ACTIONS.READ, RESOURCE.MEMBERS), MemberComponent.findAll);

/**
 * POST method route
 * @example http://localhost:PORT/api/members
 *
 * @swagger
 * /api/members:
 *   post:
 *      description: Create new User
 *      tags: ["members"]
 *      security:
 *       - ApiKeyAuth: []
 *      requestBody:
 *        description: user creation request body
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/MemberSchema'
 *            example:
 *              name: userName
 *              email: test.user@mail.com
 *      responses:
 *        201:
 *          description: return created user
 *          content:
 *            application/json:
 *              schema:
 *                oneOf:
 *                  - $ref: '#/components/schemas/MemberSchema'
 *        default:
 *          description: unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */
router.post('/', isAuthenticated, grant(ACTIONS.CREATE, RESOURCE.MEMBERS), MemberComponent.create);

/**
 * GET method route
 * @example http://localhost:PORT/api/members/:id
 *
//  * @swagger
 * /api/members/{id}:
 *  get:
 *    description: Get user by userId
 *    tags: ["members"]
 *    security:
 *      - ApiKeyAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        description: the unique userId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: return user by id
 *        content:
 *          application/json:
 *            schema:
 *              oneOf:
 *                - $ref: '#/components/schemas/MemberSchema'
 */
router.get('/:id', isAuthenticated, grant(ACTIONS.READ, RESOURCE.MEMBERS), MemberComponent.findOne);

/**
 * DELETE method route
 * @example  http://localhost:PORT/api/members/:id
 *
//  * @swagger
 * /api/members/{id}:
 *  delete:
 *    description: Delete user by userId
 *    tags: ["members"]
 *    security:
 *      - ApiKeyAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        description: the unique userId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: return deleted user
 *        content:
 *          application/json:
 *            schema:
 *              oneOf:
 *                - $ref: '#/components/schemas/MemberSchema'
 */
router.delete('/:id', isAuthenticated, grant(ACTIONS.DELETE, RESOURCE.MEMBERS), MemberComponent.remove);

/**
 * POST method route
 * @example http://localhost:PORT/api/members
 *
 * @swagger
 * /api/members/{id}:
 *   put:
 *      description: Update user
 *      tags: ["members"]
 *      security:
 *       - ApiKeyAuth: []
 *      parameters:
 *       - in: path
 *         name: id
 *         description: the unique userId
 *         required: true
 *         schema:
 *           type: string
 *      requestBody:
 *        description: user update request body
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/MemberSchema'
 *            example:
 *              name: userName
 *              email: test.user@mail.com
 *      responses:
 *        201:
 *          description: return updated user
 *          content:
 *            application/json:
 *              schema:
 *                oneOf:
 *                  - $ref: '#/components/schemas/MemberSchema'
 *        default:
 *          description: unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */
router.put('/:id', isAuthenticated, grant(ACTIONS.UPDATE, RESOURCE.MEMBERS), MemberComponent.update);

/**
 * method route
 * @example  http://localhost:PORT/api/members/inactivate/:id
 *
 * @swagger
 * /api/members/inactivate/{id}:
 *  put:
 *    description: make member inActive by id
 *    tags: ["members"]
 *    security:
 *      - ApiKeyAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        description: the unique userId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: return inActive user
 *        content:
 *          application/json:
 *            schema:
 *              oneOf:
 *                - $ref: '#/components/schemas/MemberSchema'
 */
router.put('/inactivate/:id', isAuthenticated, grant(ACTIONS.UPDATE, RESOURCE.MEMBERS), MemberComponent.inActivate);

/**
 * method route
 * @example  http://localhost:PORT/api/members/activate/:id
 *
 * @swagger
 * /api/members/activate/{id}:
 *  put:
 *    description: make member activate by id
 *    tags: ["members"]
 *    security:
 *      - ApiKeyAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        description: the unique userId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: return inActive user
 *        content:
 *          application/json:
 *            schema:
 *              oneOf:
 *                - $ref: '#/components/schemas/MemberSchema'
 */
router.put('/activate/:id', isAuthenticated, grant(ACTIONS.UPDATE, RESOURCE.MEMBERS), MemberComponent.activate);

export default router;
