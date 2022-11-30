import useLogin from "../../hooks/useLogin.js";

const Students = () => {
    useLogin("/students");
    return <>students</>;
};

export default Students;
