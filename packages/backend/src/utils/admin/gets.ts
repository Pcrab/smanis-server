import IPI from "../populateInterface.js";
import { adminModel, IAdmin } from "../../schemas/admin.js";

const getAdmins = async (props: {
    offset: number;
    count: number;
}): Promise<{
    hasNext: boolean;
    length: number;
    admins: IPI<IAdmin>[];
}> => {
    const { offset, count } = props;
    const length = await adminModel.find().count().exec();
    const admins = await adminModel.find().skip(offset).limit(count).exec();
    const hasNext = offset + count < length;
    return { length, hasNext, admins };
};

export default getAdmins;
