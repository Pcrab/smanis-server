import { FastifyPluginCallback } from "fastify";
import registerRoutes from "../../utils/registerRoutes.js";
import login from "./login.js";
import register from "./register.js";

const route: FastifyPluginCallback = (fastify, _opts, done) => {
    registerRoutes(fastify, [register, login]);

    // Finish
    done();
};

export default route;
