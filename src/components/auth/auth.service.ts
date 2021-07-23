import UserModel, { IMembersModel } from '../member/member.model';

/**
 * @export
 * @implements {IAuthService}
 */
const AuthService = {
  /**
   * @param {IMembersModel} body
   * @returns {Promise <IMembersModel>}
   * @memberof AuthService
   */
  async getUser(body: IMembersModel): Promise<IMembersModel> {
    try {
      const user: IMembersModel = await UserModel.findOne({
        email: body.email.toLowerCase(),
        isActive: true,
      });

      const isMatched: boolean = user && (await user.comparePassword(body.password));

      if (isMatched) {
        return user;
      }

      throw new Error('Invalid password or email');
    } catch (error) {
      throw new Error(error);
    }
  },
};

export default AuthService;
