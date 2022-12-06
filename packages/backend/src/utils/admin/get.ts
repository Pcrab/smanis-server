import { adminModel } from "../../schemas/admin.js";

const getAdmin = async (adminId: string) => {
    return await adminModel.findById(adminId).exec();
};

export default getAdmin;
