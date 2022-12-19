import { FastifyPluginCallback } from "fastify";
import registerRoutes from "../../utils/registerRoutes.js";
import loginStudent from "./loginStudent.js";

const route: FastifyPluginCallback = (fastify, _opts, done) => {
    registerRoutes(fastify, [loginStudent]);

    // Finish
    done();
};

export default route;
