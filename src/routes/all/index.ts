import { FastifyPluginCallback } from "fastify";
import registerRoutes from "../../utils/registerRoutes.js";
import loginStudent from "./loginStudent.js";
import loginAdmin from "./loginAdmin.js";

const route: FastifyPluginCallback = (fastify, _opts, done) => {
    registerRoutes(fastify, [loginStudent, loginAdmin]);

    // Finish
    done();
};

export default route;
