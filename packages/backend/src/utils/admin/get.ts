import { adminModel, IAdmin } from "../../schemas/admin.js";
import get from "../get.js";

const getAdmin = async (adminId: string) => {
    return await get<IAdmin>(adminModel, adminId);
};

export default getAdmin;
