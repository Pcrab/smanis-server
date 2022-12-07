import { Document } from "mongoose";
import clearEmpty from "./clearEmpty.js";

const set = async <T extends object>(
    item: Document & T,
    itemProps: {
        [K in keyof T]: T[K] | undefined;
    },
) => {
    const finalProps = clearEmpty(itemProps);
    await item.updateOne(finalProps).exec();
    return;
};

export default set;
