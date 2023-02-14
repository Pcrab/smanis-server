import { FastifyPluginCallback } from "fastify";
import { auth, AuthLevel } from "../../utils/auth.js";
import registerRoutes from "../../utils/registerRoutes.js";
import registerAdmin from "./registerAdmin.js";
import registerStudent from "./registerStudent.js";

const route: FastifyPluginCallback = (fastify, _opts, done) => {
    auth(fastify, AuthLevel.superAdmin);
    registerRoutes(fastify, [registerStudent, registerAdmin]);

    // Finish
    done();
};

export default route;
