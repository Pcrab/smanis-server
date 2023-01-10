import useLogin from "../../hooks/useLogin.js";

const Admins = () => {
    useLogin("/superAdmin", "superAdmin");

    return <>admins</>;
};

export default Admins;
