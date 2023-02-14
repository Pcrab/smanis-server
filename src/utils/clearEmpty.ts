type Entry<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T];

const clearEmpty = <T extends object>(itemProps: T) => {
    return Object.fromEntries(
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
};

export default clearEmpty;
