import * as AWS from 'aws-sdk';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import HttpError from '../config/error';
import { BUCKETNAME } from '../constants/constant';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
});
export const S3 = new AWS.S3();

const isAllowedMimetype = (mime: string) =>
  ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/x-ms-bmp', 'image/webp'].includes(mime.toString());
const fileFilter = (req: Request, file: any, callback: multer.FileFilterCallback) => {
  const fileMime = file.mimetype;
  if (isAllowedMimetype(fileMime)) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};
const getUniqFileName = (originalname: string) => {
  const name = originalname.split('.')[0] + '_' + uuidv4();
  const ext = originalname.split('.').pop();
  return `${name}.${ext}`;
};

export const handleUploadMiddleware = multer({
  fileFilter,
  storage: multerS3({
    s3: S3,
    bucket: BUCKETNAME,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req: Request, file: any, cb) {
      const fileName = getUniqFileName(file.originalname);
      const s3_inner_directory = 'public_asset';
      const finalPath = `${s3_inner_directory}/${fileName}`;

      file.newName = fileName;

      cb(null, finalPath);
    },
  }),
});

export const checkAndCreateBucket = async (req, res, next) => {
  try {
    const list = await S3.listBuckets().promise();
    const bucket = list.Buckets.find((e) => e.Name === BUCKETNAME);
    if (!bucket) {
      await S3.createBucket({
        Bucket: BUCKETNAME,
      }).promise();
    }
    next();
  } catch (error) {
    next(new HttpError(error.message.status, error.message));
  }
};
