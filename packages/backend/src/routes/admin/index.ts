import { FastifyPluginCallback } from "fastify";

const route: FastifyPluginCallback = (_fastify, _opts, done) => {
    done();
    return;
};

export default route;
