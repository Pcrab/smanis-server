import { adminModel } from "../../schemas/admin.js";

const getSuperAdmins = async (): Promise<number> => {
    return await adminModel.find({ isSuperAdmin: true }).count().exec();
};

export default getSuperAdmins;
