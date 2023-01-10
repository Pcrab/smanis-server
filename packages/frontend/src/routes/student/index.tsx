import useLogin from "../../hooks/useLogin.js";

const Students = () => {
    useLogin("/student", "student");
    return <>student</>;
};

export default Students;
