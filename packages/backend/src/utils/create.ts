import { Model } from "mongoose";
import clearEmpty from "./clearEmpty.js";

const create = async <T extends object>(model: Model<T>, itemProps: T) => {
    const finalProps = clearEmpty(itemProps);
    const item = new model(finalProps);
    await item.save();
    return item;
};

export default create;
