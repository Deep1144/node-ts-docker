import UserModel, { IMembersModel } from './member.model';
import { Types } from 'mongoose';

const MemberService = {
  async findAll(): Promise<IMembersModel[]> {
    try {
      return await UserModel.find({}).select('-password');
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async findOne(id: string): Promise<IMembersModel> {
    try {
      return await UserModel.findOne({
        _id: Types.ObjectId(id),
      }).select('-password');
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async insert(body: IMembersModel): Promise<IMembersModel> {
    try {
      const user: IMembersModel = await UserModel.create(body);
      delete user.password;
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async remove(id: string): Promise<IMembersModel> {
    try {
      const user: IMembersModel = await UserModel.findOneAndRemove({
        _id: Types.ObjectId(id),
      });
      delete user.password;
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

export default MemberService;
