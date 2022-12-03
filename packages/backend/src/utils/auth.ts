import { FastifyInstance } from "fastify";
import { verifyJwt } from "./crypto.js";

enum AuthLevel {
    student = 1,
    admin,
    superAdmin,
}

const toAuthLevel = (level?: string): AuthLevel | undefined => {
    if (level === "student") {
        return AuthLevel.student;
    } else if (level === "admin") {
        return AuthLevel.admin;
    } else if (level === "superAdmin") {
        return AuthLevel.superAdmin;
    }
    return;
};

const auth = (fastify: FastifyInstance, authLevel: AuthLevel) => {
    fastify.addHook("preValidation", async (request, reply) => {
        const token = request.headers.authorization || "";
        const { id, type } = verifyJwt(token) || {};
        const level = toAuthLevel(type);
        const operateOn = (request.body as { operateOn?: string })?.operateOn;
        if (id && level && level) {
            if (
                level >= authLevel ||
                (level === authLevel - 1 && id === operateOn)
            ) {
                return;
            }
        }
        return reply.code(401).send({ code: 404, message: "Unauthorized" });
    });
};

export { AuthLevel, toAuthLevel, auth };
