import * as bcrypt from 'bcryptjs';
import * as connections from '../../config/connection/connection';
import * as crypto from 'crypto';
import { Document, Schema, Types } from 'mongoose';
import { NextFunction } from 'express';
import { ADMINPANELROLES } from '../../constants/constant';
import HttpError from '../../config/error';

/**
 * @export
 * @interface IMembersModel
 * @extends {Document}
 */
export interface IMembersModel extends Document {
  email: string;
  role: ADMINPANELROLES;
  firstName: string;
  lastName: string;
  password: string;
  comparePassword: (password: string) => Promise<boolean>;
  gravatar: (size: number) => string;
  regionId: Array<string>;
}

/**
 * @swagger
 * components:
 *  schemas:
 *    MemberSchema:
 *      required:
 *        - role
 *      properties:
 *        _id:
 *          type: string
 *        firstName:
 *          type: string
 *        email:
 *          type: string
 *        password:
 *          type: string
 *        lastName:
 *          type: string
 *        role:
 *          type: string
 *          enum:
 *            - SUPER_ADMIN
 *            - ADMIN
 *            - MANAGER
 *            - SALES_TEAM
 *            - CRM_TEAM
 *            - OPERATIONS_TEAM
 *        regionId:
 *          type: array
 *          items:
 *            type: string
 *            format: uuid
 *    Members:
 *      type: array
 *      items:
 *        $ref: '#/components/schemas/MemberSchema'
 */
const MemberSchema: Schema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      lowercase: true,
    },
    role: { type: String, enum: Object.values(ADMINPANELROLES), required: [true, 'Role is required'] },
    firstName: String,
    lastName: String,
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    regionId: [
      {
        type: Types.ObjectId,
      },
    ],
  },
  { timestamps: true }
).pre('save', async function (next: NextFunction): Promise<void> {
  const user: any = this; // tslint:disable-line

  if (!user.isModified('password')) {
    return next();
  }

  try {
    const salt: string = await bcrypt.genSalt(10);

    const hash: string = await bcrypt.hash(user.password, salt);

    user.password = hash;
    next();
  } catch (error) {
    return next(error);
  }
});
MemberSchema.pre('save', async function (next: NextFunction) {
  const user: any = this; // tslint:disable-line
  if (user.role === ADMINPANELROLES.SUPER_ADMIN) {
    const superAdmin = await memberModel
      .findOne({
        role: ADMINPANELROLES.SUPER_ADMIN,
      })
      .lean();
    if (superAdmin && user._id.toString() != superAdmin._id.toString()) {
      throw new Error('Only one member can be super admin');
    }
  }
});

MemberSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    if (error.keyValue.email) {
      next(new HttpError(409, 'User with this email already exists'));
    }
    next(error);
  } else {
    next(error);
  }
});

/**
 * Method for comparing passwords
 */
MemberSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    const match: boolean = await bcrypt.compare(candidatePassword, this.password);

    return match;
  } catch (error) {
    return error;
  }
};

/**
 * Helper method for getting user's gravatar.
 */
MemberSchema.methods.gravatar = function (size: number): string {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5: string = crypto.createHash('md5').update(this.email).digest('hex');

  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};
const memberModel = connections.db.model<IMembersModel>('AdminPanelUsers', MemberSchema);
export default memberModel;
