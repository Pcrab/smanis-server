import { Document } from "mongoose";

type Entry<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T];

const set = async <T extends object>(
    item: Document & T,
    itemProps: {
        [K in keyof T]?: T[K] | undefined;
    },
) => {
    const finalProps = Object.fromEntries(
        (Object.entries(itemProps) as Entry<typeof itemProps>[]).filter(
            ([_, value]) => {
                if (value !== undefined && value !== "") {
                    return true;
                } else {
                    return false;
                }
            },
        ),
    );
    await item.updateOne(finalProps).exec();
    return;
};

export default set;
