import { FastifyPluginCallback } from "fastify";
import { auth, AuthLevel } from "../../utils/auth.js";
import registerRoutes from "../../utils/registerRoutes.js";
import exams from "./exams.js";
import modify from "./modify.js";

const route: FastifyPluginCallback = (fastify, _opts, done) => {
    auth(fastify, AuthLevel.student);
    registerRoutes(fastify, [modify, exams]);

    // Finish
    done();
};

export default route;
