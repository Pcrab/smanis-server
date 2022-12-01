import { FastifyInstance } from "fastify";

const registerRoutes = (
    fastify: FastifyInstance,
    routes: ((fastify: FastifyInstance) => void)[],
) => {
    routes.forEach((route) => {
        route(fastify);
    });
    return;
};

export default registerRoutes;
