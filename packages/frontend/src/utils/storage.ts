type userType = "superAdmin" | "admin" | "student" | string;

interface storageItems {
    authKey: string;
    userType: userType;
}

const getStorageItem = <T extends keyof storageItems>(
    key: T,
): storageItems[T] => {
    return localStorage.getItem(key) || "";
};

const setStorageItem = <T extends keyof storageItems>(
    key: T,
    value: storageItems[T],
) => {
    return localStorage.setItem(key, value);
};

export { getStorageItem, setStorageItem };
