import { Types } from "mongoose";
import { adminModel, IAdmin } from "../../schemas/admin.js";
import get from "../get.js";

const getAdmin = async (adminId: string | Types.ObjectId) => {
    return await get<IAdmin>(adminModel, adminId);
};

export default getAdmin;
