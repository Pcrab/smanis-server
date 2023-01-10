import useLogin from "../../hooks/useLogin.js";

const Admins = () => {
    const [userId] = useLogin("/admin", "admin");

    return <>{userId}</>;
};

export default Admins;
