import { Response, Router } from 'express';
import { checkAndCreateBucket, handleUploadMiddleware } from '../../common/upload';
import { isAuthenticated } from '../../config/middleware/jwt-auth';
const router: Router = Router();

/**
 * GET method route
 * @example http://localhost:PORT/upload/
 *
 * @swagger
 * /upload:
 *   post:
 *     tags: ['upload']
 *     security:
 *       - ApiKeyAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 # 'file' will be the field name in this multipart request
 *                 image:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: url of uploaded file
 *       default:
 *          description: unexpected error
 */
router.post(
  '/',
  isAuthenticated,
  checkAndCreateBucket,
  handleUploadMiddleware.single('image'),
  (req: any, res: Response) => {
    return res.status(200).json({
      status: 200,
      message: 'Uploaded!',
      location: req.file.location,
    });
  }
);

export default router;
