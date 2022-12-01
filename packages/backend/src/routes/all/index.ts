import { FastifyPluginCallback } from "fastify";
import registerRoutes from "../../utils/registerRoutes.js";
import login from "./login.js";

const route: FastifyPluginCallback = (fastify, _opts, done) => {
    registerRoutes(fastify, [login]);

    // Finish
    done();
};

export default route;
