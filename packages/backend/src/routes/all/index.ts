import { FastifyPluginCallback } from "fastify";
import registerRoutes from "../../utils/registerRoutes.js";
import register from "./register.js";

const route: FastifyPluginCallback = (fastify, _opts, done) => {
    registerRoutes(fastify, [register]);

    fastify.post("/login", () => {
        return "/login";
    });
    // Finish
    done();
};

export default route;
