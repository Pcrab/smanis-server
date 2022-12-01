import { FastifyPluginCallback } from "fastify";
import registerRoutes from "../../utils/registerRoutes.js";

const route: FastifyPluginCallback = (fastify, _opts, done) => {
    registerRoutes(fastify, []);

    // Finish
    done();
};

export default route;
