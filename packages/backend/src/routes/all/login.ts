import { Type, Static } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import httpErrors from "http-errors";
import { signJwt, verifyPwd } from "../../utils/crypto.js";
import getStudent from "../../utils/student/get.js";
import getAdmin from "../../utils/admin/get.js";
import {
    objectIdPattern,
    passwordPattern,
    userTypePattern,
} from "../../utils/patterns.js";

const LoginRequest = Type.Object({
    id: objectIdPattern,
    password: passwordPattern,
    type: userTypePattern,
});
type LoginRequestType = Static<typeof LoginRequest>;

const LoginResponse = Type.Object({
    token: Type.String(),
});
type LoginResponseType = Static<typeof LoginResponse>;

const login = (fastify: FastifyInstance): void => {
    fastify.post<{
        Body: LoginRequestType;
        Reply: LoginResponseType | httpErrors.HttpError;
    }>(
        "/login",
        {
            schema: {
                body: LoginRequest,
                response: {
                    200: LoginResponse,
                },
            },
        },
        async (request, response) => {
            const { id, password, type } = request.body;
            let hash = "";
            if (type === "student") {
                const student = await getStudent(id);
                hash = student?.password || "";
            } else if (type === "admin" || type === "superAdmin") {
                const admin = await getAdmin(id);
                hash = admin?.password || "";
            }
            if (hash !== "" && (await verifyPwd(hash, password))) {
                void response.status(200).send({ token: signJwt(id, type) });
            } else {
                // Login should not distinguish 404 or 400.
                void response
                    .status(400)
                    .send(httpErrors.BadRequest("Wrong id or password"));
            }
        },
    );
};

export default login;
