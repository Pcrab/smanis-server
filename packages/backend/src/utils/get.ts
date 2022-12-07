import { Model } from "mongoose";

const get = async <T extends object>(model: Model<T>, userId: string) => {
    return await model.findById(userId).exec();
};

export default get;
