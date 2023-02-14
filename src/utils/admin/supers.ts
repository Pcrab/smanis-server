import { adminModel } from "../../schemas/admin.js";

const getSuperAdminsCount = async (): Promise<number> => {
    return await adminModel.find({ isSuperAdmin: true }).count().exec();
};

export default getSuperAdminsCount;
