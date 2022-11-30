import { FastifyPluginCallback } from "fastify";
import {
    RegisterRequest,
    RegisterRequestType,
    RegisterResponse,
    RegisterResponseType,
} from "./types.js";

const route: FastifyPluginCallback = (fastify, _opts, done) => {
    fastify.post<{
        Body: RegisterRequestType;
        Reply: RegisterResponseType;
    }>(
        "/register",
        {
            schema: {
                body: RegisterRequest,
                response: {
                    201: RegisterResponse,
                },
            },
        },
        (request, response) => {
            const { username } = request.body;
            void response.status(201).send({ username, uid: 0 });
        },
    );
    fastify.post("/login", () => {
        return "/login";
    });
    done();
    return;
};

export default route;
