import MemberModel from '../../components/member/member.model';
import { ADMINPANELROLES } from '../../constants/constant';

export const importDefault = async () => {
  try {
    if (
      !process.env.SUPER_ADMIN_EMAIL ||
      !process.env.SUPER_ADMIN_PASSWORD
      // || process.env.NODE_ENV === "development"
    ) {
      // throw new Error("Super admin credentials are missing from env");
      return;
    }
    const superAdmin = await MemberModel.findOne({ role: ADMINPANELROLES.SUPER_ADMIN });
    if (!superAdmin) {
      await MemberModel.create({
        email: process.env.SUPER_ADMIN_EMAIL,
        firstName: 'Deep',
        lastName: '',
        password: process.env.SUPER_ADMIN_PASSWORD,
        role: ADMINPANELROLES.SUPER_ADMIN,
      });
    }
  } catch (error) {
    console.log('error : ', error);
  }
};
