import { FastifyPluginCallback } from "fastify";
import { auth, AuthLevel } from "../../utils/auth.js";
import registerRoutes from "../../utils/registerRoutes.js";
import modify from "./modify.js";
import changeStudent from "./changeStudent.js";
import students from "./listStudents.js";
import submitExam from "./submitExam.js";

const route: FastifyPluginCallback = (fastify, _opts, done) => {
    auth(fastify, AuthLevel.admin);
    registerRoutes(fastify, [modify, changeStudent, students, submitExam]);

    // Finish
    done();
};

export default route;
